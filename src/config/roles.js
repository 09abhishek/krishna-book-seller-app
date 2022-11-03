const allRoles = {
  user: ["submitInvoice"],
  admin: [
    "submitInvoice",
    "submitInvoice",
    "getInvoiceById",
    "deleteInvoice",
    "searchInvoice",
    "searchInvoiceByNum",
    "updateInvoice",
    "getBillNum",
  ],
  super_admin: [
    "submitInvoice",
    "submitInvoice",
    "getInvoiceById",
    "deleteInvoice",
    "searchInvoice",
    "searchInvoiceByNum",
    "updateInvoice",
    "getBillNum",
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
