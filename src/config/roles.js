const allRoles = {
  user: ["submitInvoice"],
  admin: ["submitInvoice", "submitInvoice", "getInvoiceById", "deleteInvoice", "searchInvoice"],
  super_admin: ["submitInvoice", "submitInvoice", "getInvoiceById", "deleteInvoice", "searchInvoice"],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
