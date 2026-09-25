import { organizations } from '../data/demsData'

export const PROTOTYPE_PASSWORD = 'Password@123'

const REGISTERED_USERS_KEY = 'dems_registered_users'

const normalizeIdentifier = (identifier) => identifier.trim().toLowerCase()

const getRegisteredUsers = () => {
  try {
    const users = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '[]')
    return Array.isArray(users) ? users : []
  } catch (err) {
    console.warn('Lookup error:', err)
    return []
  }
}

const findDemoUser = (identifier, password) => {
  const normalizedIdentifier = normalizeIdentifier(identifier)

  for (const org of organizations) {
    const match = org.roles.find(
      (role) =>
        role.defaultUsername.toLowerCase() === normalizedIdentifier ||
        role.defaultEmail.toLowerCase() === normalizedIdentifier
    )

    if (match) {
      if (password !== PROTOTYPE_PASSWORD) return null

      return {
        username: match.defaultUsername,
        name: match.defaultName,
        email: match.defaultEmail,
        pno: match.pno,
        orgId: org.id,
        orgName: org.name,
        roleId: match.id,
        roleName: match.name,
        cadre: match.cadre,
        station: match.station,
      }
    }
  }

  return null
}

export function authenticatePrototypeUser(identifier, password) {
  const demoUser = findDemoUser(identifier, password)
  if (demoUser) return demoUser

  const normalizedIdentifier = normalizeIdentifier(identifier)
  const registeredUser = getRegisteredUsers().find(
    (user) =>
      (user.username.toLowerCase() === normalizedIdentifier ||
        user.email.toLowerCase() === normalizedIdentifier) &&
      user.password === password
  )

  return registeredUser || null
}

export function registerPrototypeUser(user) {
  const registeredUsers = getRegisteredUsers()
  const normalizedUsername = normalizeIdentifier(user.username)
  const normalizedEmail = normalizeIdentifier(user.email)
  const duplicate = registeredUsers.some(
    (registeredUser) =>
      registeredUser.username.toLowerCase() === normalizedUsername ||
      registeredUser.email.toLowerCase() === normalizedEmail
  )

  if (duplicate) {
    return {
      ok: false,
      error: 'An account with this username or email already exists.',
    }
  }

  registeredUsers.push(user)
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers))
  return { ok: true }
}
