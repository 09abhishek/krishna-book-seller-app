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
    "getAllBooks",
    "getBooks",
    "addBooks",
    "deleteBooks",
    "updateBooks",
    "getPublication",
    "getPublications",
    "addPublications",
    "deletePublications",
    "updatePublication",
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
    "getAllBooks",
    "getBooks",
    "addBooks",
    "deleteBooks",
    "updateBooks",
    "getPublication",
    "getPublications",
    "addPublications",
    "deletePublications",
    "updatePublication",
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
