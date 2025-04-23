"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrUpdateTags = createOrUpdateTags;
exports.syncPostTags = syncPostTags;
const Tag_1 = __importDefault(require("../models/Tag"));
async function createOrUpdateTags(tagNames) {
    if (!tagNames || tagNames.length === 0)
        return [];
    const tagIds = [];
    for (const tagName of tagNames) {
        // 태그 조회
        let tag = await Tag_1.default.findOne({ name: tagName });
        // 태그 생성
        if (!tag) {
            tag = await Tag_1.default.create({ name: tagName, count: 1 });
        }
        else {
            tag.count += 1;
            await tag.save();
        }
        tagIds.push(tag._id);
    }
    return tagIds;
}
async function syncPostTags(oldTagIds, newTagNames) {
    const newTagIds = [];
    const oldTagIdSet = new Set(oldTagIds.map((id) => id.toString()));
    // 새로운 태그 처리
    for (const name of newTagNames) {
        let tag = await Tag_1.default.findOne({ name });
        if (!tag) {
            tag = await Tag_1.default.create({ name, count: 1 });
        }
        else {
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
    const removedTagIds = oldTagIds.filter((oldId) => !newTagIdSet.has(oldId.toString()));
    for (const tagId of removedTagIds) {
        const tag = await Tag_1.default.findByIdAndUpdate(tagId, { $inc: { count: -1 } }, { new: true });
        if (tag && tag.count <= 0) {
            await Tag_1.default.findByIdAndDelete(tagId);
        }
    }
    return newTagIds;
}
