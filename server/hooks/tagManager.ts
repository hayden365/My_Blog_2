import Tag from "../models/Tag";

export async function createOrUpdateTags(tagNames: string[]) {
  if (!tagNames || tagNames.length === 0) return [];

  const tagIds = [];

  for (const tagName of tagNames) {
    // 태그 조회
    let tag = await Tag.findOne({ name: tagName });

    // 태그 생성
    if (!tag) {
      tag = await Tag.create({ name: tagName, count: 1 });
    } else {
      tag.count += 1;
      await tag.save();
    }

    tagIds.push(tag._id);
  }

  return tagIds;
}

export async function syncPostTags(
  oldTagIds: string[],
  newTagNames: string[]
): Promise<string[]> {
  const newTagIds: string[] = [];
  const oldTagIdSet = new Set(oldTagIds.map((id) => id.toString()));

  // 새로운 태그 처리
  for (const name of newTagNames) {
    let tag = await Tag.findOne({ name });

    if (!tag) {
      tag = await Tag.create({ name, count: 1 });
    } else {
      const isNewForThisPost = !oldTagIdSet.has(tag._id.toString());
      if (isNewForThisPost) {
        tag.count += 1;
        await tag.save();
      }
    }

    newTagIds.push(tag._id.toString());
  }

  // 제거된 태그 처리
  const newTagIdSet = new Set(newTagIds);
  const removedTagIds = oldTagIds.filter(
    (oldId) => !newTagIdSet.has(oldId.toString())
  );

  for (const tagId of removedTagIds) {
    const tag = await Tag.findByIdAndUpdate(
      tagId,
      { $inc: { count: -1 } },
      { new: true }
    );
    if (tag && tag.count <= 0) {
      await Tag.findByIdAndDelete(tagId);
    }
  }

  return newTagIds;
}
