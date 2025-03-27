const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^[ㄱ-ㅎ가-힣a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export default slugify;
