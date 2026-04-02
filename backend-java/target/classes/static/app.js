const $ = (id) => document.getElementById(id);

const inputText = $("inputText");
const outputText = $("outputText");
const sourceLang = $("sourceLang");
const targetLang = $("targetLang");
const swapBtn = $("swapBtn");
const clearBtn = $("clearBtn");
const copyBtn = $("copyBtn");
const translateBtn = $("translateBtn");
const translateLoading = $("translateLoading");
const errorBox = $("errorBox");

function setError(message) {
  if (!message) {
    errorBox.hidden = true;
    errorBox.textContent = "";
    return;
  }
  errorBox.hidden = false;
  errorBox.textContent = message;
}

function getPayload() {
  return {
    text: inputText.value,
    sourceLang: sourceLang.value,
    targetLang: targetLang.value,
  };
}

async function doTranslate() {
  setError("");
  const payload = getPayload();
  const clean = (payload.text || "").trim();
  if (!clean) {
    setError("Vui lòng nhập văn bản để dịch.");
    return;
  }

  translateBtn.disabled = true;
  translateLoading.hidden = false;

  try {
    const resp = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => null);
      const msg = err?.message || "Dịch thất bại. Vui lòng thử lại.";
      setError(msg);
      outputText.value = "";
      return;
    }

    const data = await resp.json();
    outputText.value = data?.translatedText ?? "";
  } catch (e) {
    setError("Không thể kết nối tới máy chủ dịch. Kiểm tra lại backend.");
    outputText.value = "";
  } finally {
    translateBtn.disabled = false;
    translateLoading.hidden = true;
  }
}

swapBtn.addEventListener("click", () => {
  const oldSource = sourceLang.value;
  sourceLang.value = targetLang.value;
  targetLang.value = oldSource;

  const oldText = inputText.value;
  inputText.value = outputText.value;
  outputText.value = oldText;

  setError("");
});

clearBtn.addEventListener("click", () => {
  inputText.value = "";
  outputText.value = "";
  setError("");
});

copyBtn.addEventListener("click", async () => {
  const text = (outputText.value || "").trim();
  if (!text) {
    setError("Chưa có nội dung để copy.");
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    setError("");
  } catch {
    setError("Không thể copy tự động trên trình duyệt này.");
  }
});

translateBtn.addEventListener("click", doTranslate);

// Enter to translate (nice UX)
inputText.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
    doTranslate();
  }
});

