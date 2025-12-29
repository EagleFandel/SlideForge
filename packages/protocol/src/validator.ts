import type { SlideDocument, Slide, Element } from "./types";

export interface ValidationError {
  path: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

const VALID_SLIDE_TYPES = [
  "title", "section", "content", "image", 
  "code", "comparison", "timeline", "quote", "blank"
];

const VALID_ELEMENT_TYPES = [
  "heading", "text", "list", "image", 
  "code", "chart", "shape", "video", "table"
];

function validateElement(element: Element, index: number, slideIndex: number): ValidationError[] {
  const errors: ValidationError[] = [];
  const path = `slides[${slideIndex}].elements[${index}]`;

  if (!element.type) {
    errors.push({ path, message: "Element type is required", code: "MISSING_TYPE" });
  } else if (!VALID_ELEMENT_TYPES.includes(element.type)) {
    errors.push({ path, message: `Invalid element type: ${element.type}`, code: "INVALID_TYPE" });
  }

  // Type-specific validation
  if (element.type === "heading") {
    if (!("text" in element) || !element.text) {
      errors.push({ path, message: "Heading requires text", code: "MISSING_TEXT" });
    }
    if (!("level" in element) || element.level < 1 || element.level > 6) {
      errors.push({ path, message: "Heading level must be 1-6", code: "INVALID_LEVEL" });
    }
  }

  if (element.type === "text" && !("content" in element)) {
    errors.push({ path, message: "Text element requires content", code: "MISSING_CONTENT" });
  }

  if (element.type === "list" && !("items" in element)) {
    errors.push({ path, message: "List element requires items", code: "MISSING_ITEMS" });
  }

  if (element.type === "image" && !("src" in element)) {
    errors.push({ path, message: "Image element requires src", code: "MISSING_SRC" });
  }

  if (element.type === "code") {
    if (!("content" in element)) {
      errors.push({ path, message: "Code element requires content", code: "MISSING_CONTENT" });
    }
    if (!("language" in element)) {
      errors.push({ path, message: "Code element requires language", code: "MISSING_LANGUAGE" });
    }
  }

  return errors;
}

function validateSlide(slide: Slide, index: number): ValidationError[] {
  const errors: ValidationError[] = [];
  const path = `slides[${index}]`;

  if (!slide.type) {
    errors.push({ path, message: "Slide type is required", code: "MISSING_TYPE" });
  } else if (!VALID_SLIDE_TYPES.includes(slide.type)) {
    errors.push({ path, message: `Invalid slide type: ${slide.type}`, code: "INVALID_TYPE" });
  }

  if (!slide.elements || !Array.isArray(slide.elements)) {
    errors.push({ path, message: "Slide elements must be an array", code: "INVALID_ELEMENTS" });
  } else {
    slide.elements.forEach((element, i) => {
      errors.push(...validateElement(element, i, index));
    });
  }

  return errors;
}

export function validate(doc: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!doc || typeof doc !== "object") {
    return { valid: false, errors: [{ path: "", message: "Document must be an object", code: "INVALID_DOC" }] };
  }

  const document = doc as SlideDocument;

  // Version check
  if (document.version !== "1.0") {
    errors.push({ path: "version", message: "Version must be '1.0'", code: "INVALID_VERSION" });
  }

  // Metadata check
  if (!document.metadata) {
    errors.push({ path: "metadata", message: "Metadata is required", code: "MISSING_METADATA" });
  } else if (!document.metadata.title) {
    errors.push({ path: "metadata.title", message: "Title is required", code: "MISSING_TITLE" });
  }

  // Config check
  if (!document.config) {
    errors.push({ path: "config", message: "Config is required", code: "MISSING_CONFIG" });
  } else {
    if (!document.config.theme) {
      errors.push({ path: "config.theme", message: "Theme is required", code: "MISSING_THEME" });
    }
    if (!document.config.aspectRatio) {
      errors.push({ path: "config.aspectRatio", message: "Aspect ratio is required", code: "MISSING_ASPECT_RATIO" });
    } else if (!["16:9", "4:3"].includes(document.config.aspectRatio)) {
      errors.push({ path: "config.aspectRatio", message: "Aspect ratio must be '16:9' or '4:3'", code: "INVALID_ASPECT_RATIO" });
    }
  }

  // Slides check
  if (!document.slides || !Array.isArray(document.slides)) {
    errors.push({ path: "slides", message: "Slides must be an array", code: "INVALID_SLIDES" });
  } else if (document.slides.length === 0) {
    errors.push({ path: "slides", message: "At least one slide is required", code: "EMPTY_SLIDES" });
  } else {
    document.slides.forEach((slide, index) => {
      errors.push(...validateSlide(slide, index));
    });
  }

  return { valid: errors.length === 0, errors };
}
