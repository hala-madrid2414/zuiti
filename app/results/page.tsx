"use client";

import { useCallback, useEffect, useMemo } from "react";
import { MobileShell } from "@/components/MobileShell";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ResultCard } from "@/components/ResultCard";
import { TopBar } from "@/components/TopBar";
import { results } from "@/components/content";
import {
  createRequestKey,
  useExpressionFlowStore,
  type GenerateDraft,
  type GenerateResult,
  type OutputMode,
} from "@/stores/expression-flow-store";
import { generateExpression, sendFeedback, trackEvent } from "@/utils/expression-api";
import styles from "./page.module.css";

const resultMeta = Object.fromEntries(results.map((item) => [item.mode, item])) as Record<
  OutputMode,
  (typeof results)[number]
>;

function getRecommendedText(result: GenerateResult, mode: OutputMode) {
  const output = result[mode];
  return output.candidates[output.recommendedIndex] ?? output.candidates[0];
}

export default function ResultsPage() {
  const text = useExpressionFlowStore((state) => state.text);
  const sessionId = useExpressionFlowStore((state) => state.sessionId);
  const generation = useExpressionFlowStore((state) => state.generation);
  const buildDraft = useExpressionFlowStore((state) => state.buildDraft);
  const setGenerationLoading = useExpressionFlowStore((state) => state.setGenerationLoading);
  const setGenerationSuccess = useExpressionFlowStore((state) => state.setGenerationSuccess);
  const setGenerationError = useExpressionFlowStore((state) => state.setGenerationError);

  const draft = buildDraft();
  const requestKey = draft ? createRequestKey(draft) : null;
  const generatedResult = generation.result;

  const runGenerate = useCallback(
    async (nextDraft: GenerateDraft) => {
      const nextRequestKey = createRequestKey(nextDraft);
      setGenerationLoading(nextRequestKey);
      const response = await generateExpression(nextDraft);

      if (response.ok) {
        setGenerationSuccess(response.data, nextRequestKey);
        return;
      }

      setGenerationError(
        response.code === "SAFETY_REFUSED" ? "refused" : "fail",
        response.code,
        response.message,
      );
    },
    [setGenerationError, setGenerationLoading, setGenerationSuccess],
  );

  useEffect(() => {
    if (!draft || !requestKey) {
      return;
    }

    if (generation.status === "success" && generation.requestKey === requestKey) {
      return;
    }

    if (generation.status === "loading" && generation.requestKey === requestKey) {
      return;
    }

    if (
      (generation.status === "fail" || generation.status === "refused") &&
      generation.requestKey === requestKey
    ) {
      return;
    }

    void runGenerate(draft);
  }, [draft, generation.requestKey, generation.status, requestKey, runGenerate]);

  const cards = useMemo(() => {
    if (!generatedResult) {
      return [];
    }

    return (["wechat", "email", "spoken"] as const).map((mode) => {
      const meta = resultMeta[mode];
      const output = generatedResult[mode];

      return {
        ...meta,
        text: getRecommendedText(generatedResult, mode),
        tags: output.reasons,
        mode,
      };
    });
  }, [generatedResult]);

  const handleCopy = async (mode: OutputMode) => {
    if (!generatedResult) {
      return;
    }

    const copiedText = getRecommendedText(generatedResult, mode);
    await navigator.clipboard?.writeText(copiedText);
    void trackEvent({
      sessionId,
      event: "copy_result",
      payload: {
        mode,
        candidateIndex: generatedResult[mode].recommendedIndex,
      },
    });
  };

  const handleUseful = (mode: OutputMode) => {
    void sendFeedback({
      sessionId,
      resultId: `${sessionId}-${mode}`,
      useful: true,
      reasonTags: generatedResult?.[mode].reasons ?? ["usable"],
    });
  };

  const handleRegenerate = () => {
    const nextDraft = buildDraft("regenerate");
    if (nextDraft) {
      void runGenerate(nextDraft);
    }
  };

  return (
    <MobileShell className={styles.container}>
      <TopBar
        title="转换结果"
        subtitle="已为你生成 3 种表达版本"
        backHref="/tone"
        actions={[
          { label: "收藏", icon: "star" },
          { label: "分享", icon: "share" },
        ]}
      />

      <div className={styles.content}>
        <section className={`soft-card ${styles.originalCard}`}>
          <span>原话</span>
          <p>{text.trim() || "还没有输入原话，请先回到输入页补充。"}</p>
        </section>

        {!draft ? (
          <section className={`soft-card ${styles.stateCard}`}>
            <h2>还不能生成结果</h2>
            <p>请先选择沟通场景，并输入至少 2 个字的真实想法。</p>
            <PrimaryButton href="/input" sparkle>
              返回输入
            </PrimaryButton>
          </section>
        ) : null}

        {draft && generation.status === "loading" ? (
          <section className={`soft-card ${styles.stateCard}`}>
            <h2>正在生成</h2>
            <p>正在把你的真实想法转换成更适合发送、书写和当面表达的版本。</p>
          </section>
        ) : null}

        {draft && generation.status === "refused" ? (
          <section className={`soft-card ${styles.stateCard}`}>
            <h2>这句话需要换个目标</h2>
            <p>{generation.errorMessage ?? "当前表达风险较高，请改为描述事实、影响和诉求。"}</p>
            <PrimaryButton href="/input" sparkle>
              修改原话
            </PrimaryButton>
          </section>
        ) : null}

        {draft && generation.status === "fail" ? (
          <section className={`soft-card ${styles.stateCard}`}>
            <h2>生成暂时失败</h2>
            <p>{generation.errorMessage ?? "服务暂时不可用，请稍后再试。"}</p>
            <button type="button" className="primary-button" onClick={handleRegenerate}>
              <span>重试一次</span>
            </button>
          </section>
        ) : null}

        {cards.length > 0 && generation.status === "success" ? (
          <section className={styles.resultsList}>
            {cards.map((result, index) => (
              <ResultCard
                key={result.label}
                {...result}
                index={index}
                onCopy={() => void handleCopy(result.mode)}
                onUseful={() => handleUseful(result.mode)}
                onRegenerate={handleRegenerate}
                onSwitchStyle={() => {
                  void trackEvent({
                    sessionId,
                    event: "switch_style_from_result",
                    payload: { mode: result.mode },
                  });
                  window.location.href = "/input";
                }}
              />
            ))}
          </section>
        ) : null}

        <button type="button" className={styles.compareButton}>
          <span aria-hidden="true" />
          查看“原话 → 优化版”的变化点
        </button>
      </div>

      <div className={styles.bottomActions}>
        <a href="/tone" className={styles.secondaryButton}>
          再调整语气
        </a>
        <PrimaryButton href="/input" sparkle>
          换一种风格
        </PrimaryButton>
      </div>
    </MobileShell>
  );
}
