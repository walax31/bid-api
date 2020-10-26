module.exports = function specificationUtil(SpecificationModel) {
  const withReferences = (references) => {
    const Sepcification = SpecificationModel.query()

    if (references) {
      const extractedReferences = references.split(',')

      extractedReferences.forEach(reference => Specification.with(reference))
    }

    return Specification
  }

  return {
    getAll: (references) => withReferences(references).fetch()
  }
}
