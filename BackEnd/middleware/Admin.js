const permissions = require('./permission');
  // Middleware to check if the user has permission to perform an action
  const checkPermission = (action, user) => {
    // In the absence of actual authentication, we assume 'user' is directly provided here
    if (!user || !user.role) {
      return (req, res) => {
        return res.status(403).json({ message: 'Forbidden' });
      };
    }
  
    // Get the role's permissions
    const rolePermissions = permissions[user.role] || [];
  
    // Check if the role has the necessary permission
    if (!rolePermissions.includes(action)) {
      return (req, res) => {
        return res.status(403).json({ message: 'You do not have permission to perform this action' });
      };
    }
  
    // Allow the action to proceed if the permission is valid
    return (req, res, next) => {
      next();
    };
  };
  
  module.exports = checkPermission;
  