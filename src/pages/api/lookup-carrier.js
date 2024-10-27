import twilio from 'twilio';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  // Format phone number to E.164 format
  let formattedNumber;
  try {
    // Remove all non-numeric characters except +
    let cleanNumber = phoneNumber.replace(/[^\d+]/g, '');
    
    // Ensure it starts with +
    if (!cleanNumber.startsWith('+')) {
      cleanNumber = `+${cleanNumber}`;
    }
    
    // Ensure it has country code
    if (cleanNumber.length === 11 && cleanNumber.startsWith('+')) {
      cleanNumber = `+1${cleanNumber.slice(1)}`;
    }
    
    formattedNumber = cleanNumber;
    console.log('Formatted number for Twilio:', formattedNumber);
  } catch (error) {
    console.error('Error formatting number:', error);
    return res.status(400).json({ error: 'Invalid phone number format' });
  }

  const accountSid = "AC36571b49e45091c0f3b7925973d489b9";
  const authToken = "472598780b048531c98ffee6cd9bb236";

  try {
    const client = twilio(accountSid, authToken);
    
    // Using the v2 Lookup API as per documentation
    const phoneNumberDetails = await client.lookups.v2
      .phoneNumbers(formattedNumber)
      .fetch({
        fields: ['line_type_intelligence'] // Adding carrier information
      });

    console.log('Twilio response:', phoneNumberDetails);

    // Check if the number is valid
    if (!phoneNumberDetails.valid) {
      return res.status(404).json({ 
        error: 'Invalid phone number',
        validationErrors: phoneNumberDetails.validation_errors
      });
    }

    // Get carrier info from line_type_intelligence
    const carrier = phoneNumberDetails.lineTypeIntelligence?.carrier_name || 'Unknown';

    return res.status(200).json({ 
      success: true,
      carrier,
      details: {
        valid: phoneNumberDetails.valid,
        countryCode: phoneNumberDetails.country_code,
        nationalFormat: phoneNumberDetails.national_format,
        carrier: carrier
      }
    });

  } catch (error) {
    console.error('Twilio API error:', error);
    
    if (error.status === 404) {
      return res.status(404).json({ 
        error: 'Phone number not found',
        message: `Invalid number format. Tried: ${formattedNumber}`
      });
    }

    return res.status(500).json({ 
      error: 'Failed to lookup carrier',
      message: error.message || 'Unknown error occurred'
    });
  }
}






const accountSid = "AC36571b49e45091c0f3b7925973d489b9";
const authToken = "472598780b048531c98ffee6cd9bb236";