import User from '../models/User.js'
import { sendTokenResponse } from '../utils/jwt.js'

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user already exists
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email already registered.'
      })
    }

    const user = await User.create({ name, email, password })
    sendTokenResponse(user, 201, res)
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password.'
      })
    }

    // Explicitly select password (it's excluded by default)
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password.'
      })
    }

    sendTokenResponse(user, 200, res)
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
}

// LOGOUT
export const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 1000),
    httpOnly: true
  })
  res.status(200).json({ status: 'success', message: 'Logged out.' })
}

// GET CURRENT USER (me)
export const getMe = async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  })
}
