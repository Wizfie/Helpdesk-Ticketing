import prisma from '../lib/prisma.js';

export async function calculateSlaDeadlines({ customerId, severity = 'MEDIUM', createdAt = new Date() }) {
  // 1. Fetch customer with contract tier and SLA code
  const customer = await prisma.customer.findUnique({
    where: { id: Number(customerId) }
  });

  const contractTier = (customer?.contractTier || '8x5 GOLD ENTERPRISE').toUpperCase();
  const contractSla = customer?.contractSla;
  
  // 2. Fetch or match corresponding SLA policy
  let policy = null;
  if (contractSla) {
    policy = await prisma.slaPolicy.findUnique({
      where: { tierCode: contractSla }
    });
  }

  if (!policy) {
    let tierCode = 'GOLD_8X5';
    if (contractSla?.includes('PLATINUM') || contractTier.includes('PLATINUM')) tierCode = 'PLATINUM_24X7';
    else if (contractSla?.includes('SILVER') || contractTier.includes('SILVER')) tierCode = 'SILVER_8X5';
    else if (contractSla?.includes('GOV') || contractTier.includes('GOV')) tierCode = 'GOV_TIER1';

    policy = await prisma.slaPolicy.findUnique({
      where: { tierCode }
    });
  }

  let respHours = 1.0;
  let resHours = 8.0;

  if (policy) {
    if (severity === 'HIGH') {
      respHours = policy.p1ResponseHours;
      resHours = policy.p1ResolutionHours;
    } else if (severity === 'MEDIUM') {
      respHours = policy.p2ResponseHours;
      resHours = policy.p2ResolutionHours;
    } else if (severity === 'LOW') {
      respHours = policy.p3ResponseHours || policy.p4ResponseHours || 4.0;
      resHours = policy.p3ResolutionHours || policy.p4ResolutionHours || 24.0;
    } else {
      respHours = policy.p4ResponseHours || 4.0;
      resHours = policy.p4ResolutionHours || 72.0;
    }
  } else {
    // Default fallback
    respHours = severity === 'HIGH' ? 0.5 : severity === 'MEDIUM' ? 1.0 : 2.0;
    resHours = severity === 'HIGH' ? 4.0 : severity === 'MEDIUM' ? 8.0 : 16.0;
  }

  const responseDeadline = new Date(createdAt.getTime() + respHours * 3600 * 1000);
  const resolutionDeadline = new Date(createdAt.getTime() + resHours * 3600 * 1000);

  return {
    contractTier: customer?.contractTier || '8x5 GOLD ENTERPRISE',
    responseDeadline,
    resolutionDeadline,
    respHours,
    resHours
  };
}

export function evaluateSlaBreach(ticket) {
  const now = new Date();
  let isResponseBreached = ticket.isSlaResponseBreached;
  let isResolutionBreached = ticket.isSlaResolutionBreached;

  if (!ticket.respondedAt && ticket.responseDeadline) {
    isResponseBreached = now > new Date(ticket.responseDeadline);
  }

  if (!ticket.resolvedAt && ticket.resolutionDeadline && !ticket.isPaused) {
    isResolutionBreached = now > new Date(ticket.resolutionDeadline);
  }

  return {
    isResponseBreached,
    isResolutionBreached
  };
}
