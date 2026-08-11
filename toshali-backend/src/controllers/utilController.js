import axios from 'axios'
import countryCodes from '../utils/countryCodes.js'

export const getCountryCodes = (req, res) => {
  res.status(200).json(countryCodes)
}

export const getPincodeDetails = async (req, res) => {
  try {
    const { pincode } = req.params

    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({ message: 'Enter a valid 6-digit pincode.' })
    }

    const { data } = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`)
    const result = data?.[0]

    if (!result || result.Status !== 'Success' || !result.PostOffice?.length) {
      return res.status(404).json({ message: 'No details found for this pincode.' })
    }

    const office = result.PostOffice[0]

    res.status(200).json({
      city: office.District,
      state: office.State,
      country: 'India',
    })
  } catch (error) {
    console.error('getPincodeDetails error:', error)
    res.status(500).json({ message: 'Could not fetch pincode details. Please try again later.' })
  }
}