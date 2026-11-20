import prisma from '../lib/prisma.js';

export async function calculateSlaDeadlines({ customerId, severity = 'MEDIUM', createdAt = new Date() }) {
  // 1. Fetch customer with SLA tier
  const customer = await prisma.customer.findUnique({
    where: { id: Number(customerId) }
  });

  const slaTier = customer?.slaTier || '8x5 GOLD ENTERPRISE';
  
  // 2. Fetch or match corresponding SLA policy
  let policy = await prisma.slaPolicy.findFirst({
    where: {
      OR: [
        { tierName: slaTier },
        { tierName: { contains: slaTier } }
      ]
    }
  });

  if (!policy) {
    const upper = slaTier.toUpperCase();
    let keyword = 'GOLD';
    if (upper.includes('PLATINUM')) keyword = 'PLATINUM';
    else if (upper.includes('SILVER')) keyword = 'SILVER';
    else if (upper.includes('GOV')) keyword = 'GOV';

    policy = await prisma.slaPolicy.findFirst({
      where: {
        tierName: { contains: keyword }
      }
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
    contractTier: customer?.slaTier || '8x5 GOLD ENTERPRISE',
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
