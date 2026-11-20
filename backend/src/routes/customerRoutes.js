import express from 'express';
import { 
  getCustomers, 
  getCustomerById, 
  createCustomer, 
  updateCustomer, 
  deleteCustomer,
  addCustomerPic,
  updateCustomerPic,
  deleteCustomerPic,
  getIndustrySectors,
  createIndustrySector,
  deleteIndustrySector
} from '../controllers/customerController.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Master Industry Sectors (MUST BE BEFORE /:id)
router.get('/sectors', authenticate, getIndustrySectors);
router.post('/sectors', authenticate, authorizeRoles(['ADMIN']), createIndustrySector);
router.delete('/sectors/:id', authenticate, authorizeRoles(['ADMIN']), deleteIndustrySector);

router.get('/', authenticate, getCustomers);
router.get('/:id', authenticate, getCustomerById);
router.post('/', authenticate, authorizeRoles(['ADMIN']), createCustomer);
router.put('/:id', authenticate, authorizeRoles(['ADMIN']), updateCustomer);
router.delete('/:id', authenticate, authorizeRoles(['ADMIN']), deleteCustomer);

// PIC Sub-routes
router.post('/:id/pics', authenticate, authorizeRoles(['ADMIN']), addCustomerPic);
router.put('/:id/pics/:picId', authenticate, authorizeRoles(['ADMIN']), updateCustomerPic);
router.delete('/:id/pics/:picId', authenticate, authorizeRoles(['ADMIN']), deleteCustomerPic);

export default router;
