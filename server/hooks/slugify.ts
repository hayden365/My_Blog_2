import Post from "../models/Post";

const slugify = async (text: string, existingSlug?: string) => {
  let baseSlug = text
    .toLowerCase()
    .trim()
    .replace(/[^[ㄱ-ㅎ가-힣a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // 기존 slug가 있고, 수정하려는 slug가 기존 slug와 같다면 중복 체크를 하지 않음
  if (existingSlug && existingSlug === baseSlug) {
    return baseSlug;
  }

  // 새로운 slug 생성 시에만 중복 체크
  let slug = baseSlug;
  let counter = 1;

  while (await Post.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

export default slugify;
