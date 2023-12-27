import { sendOTP, verifyOTP } from './otpService';
import { cacheUserData } from './cacheService';

async function signUp(
  email: string,
  phone: string,
  password: string,
  referralId: string,
  ip: string,
  device: string,
  region: string
) {
  const startTime = Date.now();
  try {
    // connnect to client
    // await client.connect();
    //const db: Db = client.db('your_database');
    
    // Validate input 
    // check req body has correct and valid parameters

    //and check for duplicate users
    const existingUser = await client.query(
      'SELECT * FROM users WHERE email = $1 OR phone = $2',
      [email, phone]
    );

    if (existingUser) {
      throw new Error('User with the same email or phone number already exists.');
    }

    // Referral logic
    // (check if referralId is valid)
    if (referralId) {
      const referrer = await db.collection('users').findOne({ referralId });

      // using SQL
      // const referrer = await client.query('SELECT * FROM users WHERE referral_id = $1', [
      //   referralId,
      // ]);

      if (!referrer) {
        throw new Error('Invalid referral ID. Referrer not found.');
      }
    }

    // Generate and send OTP
    const otpCode = await sendOTP(email || phone);

    // Check if OTP verification is successful
    const isVerified = await verifyOTP(email || phone, 'otpCode');

    if (isVerified) {
      // Save user details to the database
      const newUser = await db.collection('users').insertOne({
        email,
        phone,
        password,
        referralId,
        ip,
        device,
        region,
      });

      // using SQL
      // const newUser = await client.query(
      //   'INSERT INTO users (email, phone, password, referral_id, ip, device, region) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      // );

      // add user to the database
      const userId = newUser.insertedId;

      // Cache user information
      // to optimize performace // add in Redis DB
      cacheUserData(userId.toString(), { email, phone, ip, device });

      // Log health data
      logHealthData('signUp', Date.now() - startTime, false);
    } else {
      // Log health data for OTP verification failure
      logHealthData('signUp', Date.now() - startTime, true);
    }
  } catch (error) {
    // we cal also have a proper error handler to have all errors handles instead of duplicating the code
    console.error(error);
    logHealthData('signUp', Date.now() - startTime, true);
    throw new Error('Sign-up failed.');
  } finally {
    // close DB connection
  }
}

function logHealthData(operation: string, executionTime: number, isError: boolean) {
  // we can use winston logger to log data or just do console.log for now
}


export { signUp };
