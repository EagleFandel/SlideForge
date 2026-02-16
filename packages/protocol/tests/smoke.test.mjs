import test from "node:test";
import assert from "node:assert/strict";
import {
  createSlide,
  createSlideDocument,
  createText,
  validate,
} from "../dist/index.mjs";

test("protocol can build and validate a minimal document", () => {
  const doc = createSlideDocument("Smoke Test");
  const slide = createSlide("content");
  slide.elements.push(createText("hello"));
  doc.slides.push(slide);

  const result = validate(doc);
  assert.equal(result.valid, true);
  assert.equal(result.errors.length, 0);
});
