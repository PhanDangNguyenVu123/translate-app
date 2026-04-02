def translate(text: str, source_lang: str, target_lang: str) -> str:
    """
    Placeholder translation:
    - Stage 1: Return a deterministic pseudo-translation so end-to-end integration works.
    - Stage 2: Replace this with local Transformer NMT inference.
    """
    normalized_source = (source_lang or "").strip().lower()
    normalized_target = (target_lang or "").strip().lower()

    clean = (text or "").strip()
    if not clean:
        return ""

    # Vietnamese -> Ba Na demo placeholder
    if normalized_source in {"vi", "vietnamese"} and normalized_target in {"bna", "ban"}:
        return f"[BaNa-demo] {clean}"

    # Generic fallback placeholder for other directions
    return f"[{normalized_target or 'target'}-demo] {clean}"

