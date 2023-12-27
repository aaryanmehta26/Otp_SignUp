import { signUp } from "../services/authService";
import { getRegionByIP } from "../services/geoipService";

import express from 'express';

const router = express.router();

router.post('/signup', async (req: any, res: any) => {
  const { email, phone, password, referralId, ip, device } = req.body;

  // Get user region by IP
  const region = await getRegionByIP(ip);

  // Call the signup service
  await signUp(email, phone, password, referralId, ip, device, region);

  res.json({ success: true });
});

export default router;
