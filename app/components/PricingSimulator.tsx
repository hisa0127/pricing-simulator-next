'use client'

import { useState, useCallback } from 'react'
import './PricingSimulator.css'

type Mode = 'direct' | 'partner'
type ProjectType = 'lp' | 'hp'

interface PriceItem {
  label: string
  directPrice: number
  partnerPrice: number
  tooltip: string
}

const PRICES: Record<string, PriceItem> = {
  lp: {
    label: 'LP制作（コーディング）',
    directPrice: 120000,
    partnerPrice: 70000,
    tooltip:
      'デザインカンプをもとにしたコーディング。構成・デザイン込みのご依頼もご相談可能です。',
  },
  hpTop: {
    label: 'HPトップページ',
    directPrice: 80000,
    partnerPrice: 50000,
    tooltip: 'サイトの顔となるトップページのコーディングです。',
  },
  hpSub: {
    label: 'HP下層ページ',
    directPrice: 20000,
    partnerPrice: 12000,
    tooltip:
      'About・Service・Contactなどの各下層ページです。ページ数に応じて加算されます。',
  },
  wordpress: {
    label: 'WordPress構築',
    directPrice: 70000,
    partnerPrice: 45000,
    tooltip:
      'お知らせ・カスタム投稿タイプ等、管理画面から自分で更新できる仕組みを実装します。',
  },
  form: {
    label: 'お問い合わせフォーム',
    directPrice: 25000,
    partnerPrice: 15000,
    tooltip:
      'バリデーション・自動返信メール付きのお問い合わせフォームを実装します。',
  },
  complex: {
    label: '複雑な実装',
    directPrice: 40000,
    partnerPrice: 20000,
    tooltip:
      'スクロールアニメーションやインタラクティブなUI等、標準を超える実装が必要な場合に加算されます。',
  },
}

// デザイン制作の目安料金（直請けのみ表示。パートナー案件はデザイン持ち込みのため対象外）
const DESIGN_PRICES = {
  lp: 80000,
  hpTop: 50000,
  hpSub: 10000,
}

const CONTACT_EMAIL = 'hisatoshi.webwork@gmail.com'

const fmt = (n: number) => n.toLocaleString('ja-JP')

function InfoIcon({ tooltip }: { tooltip: string }) {
  const [open, setOpen] = useState(false)

  return (
    <span className="ps-tooltip-wrap">
      <button
        type="button"
        className="ps-info-icon"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        aria-label="詳細情報を表示"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="7.5" cy="7.5" r="7" stroke="currentColor" />
          <path
            d="M7.5 6.5v4.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle cx="7.5" cy="4.5" r="0.75" fill="currentColor" />
        </svg>
      </button>
      {open && (
        <span className="ps-tooltip" role="tooltip">
          {tooltip}
        </span>
      )}
    </span>
  )
}

interface PricingSimulatorProps {
  /** 指定するとモードを固定し、切替タブを非表示にする */
  fixedMode?: Mode
}

export default function PricingSimulator({
  fixedMode,
}: PricingSimulatorProps) {
  const [mode, setMode] = useState<Mode>(fixedMode ?? 'direct')
  const [type, setType] = useState<ProjectType>('lp')
  const [subPages, setSubPages] = useState(3)
  const [wordpress, setWordpress] = useState(false)
  const [form, setForm] = useState(false)
  const [complex, setComplex] = useState(false)
  const [design, setDesign] = useState(false)
  const [copied, setCopied] = useState(false)

  const price = useCallback(
    (key: string) =>
      mode === 'direct' ? PRICES[key].directPrice : PRICES[key].partnerPrice,
    [mode]
  )

  // デザイン制作の目安額（制作種別・ページ数に連動）
  const designPrice =
    type === 'lp'
      ? DESIGN_PRICES.lp
      : DESIGN_PRICES.hpTop + DESIGN_PRICES.hpSub * subPages

  const total =
    (type === 'lp'
      ? price('lp')
      : price('hpTop') + price('hpSub') * subPages) +
    (design && mode === 'direct' ? designPrice : 0) +
    (wordpress ? price('wordpress') : 0) +
    (form ? price('form') : 0) +
    (complex ? price('complex') : 0)

  const buildSummary = useCallback(() => {
    const lines: string[] = ['【料金シミュレーター 概算見積もり】']
    lines.push(
      `属性: ${mode === 'direct' ? 'エンドユーザー（直請け）' : '制作会社（パートナー）'}`
    )
    lines.push('')
    if (type === 'lp') {
      lines.push(`・LP制作（コーディング）: ¥${fmt(price('lp'))}`)
    } else {
      lines.push(`・HPトップページ: ¥${fmt(price('hpTop'))}`)
      lines.push(
        `・HP下層ページ × ${subPages}枚: ¥${fmt(price('hpSub') * subPages)}`
      )
    }
    if (design && mode === 'direct') {
      lines.push(`・デザイン制作: ¥${fmt(designPrice)}`)
    }
    if (wordpress) lines.push(`・WordPress構築: ¥${fmt(price('wordpress'))}`)
    if (form) lines.push(`・お問い合わせフォーム: ¥${fmt(price('form'))}`)
    if (complex) lines.push(`・複雑な実装: ¥${fmt(price('complex'))}`)
    lines.push('')
    lines.push(`概算合計（税込）: ¥${fmt(total)}〜`)
    lines.push('')
    lines.push('上記の内容でお見積もりをお願いしたいです。')
    return lines.join('\n')
  }, [mode, type, subPages, wordpress, form, complex, design, designPrice, price, total])

  const handleContact = useCallback(async () => {
    const summary = buildSummary()

    // クリップボードにコピーできる環境ならコピーしておく（貼り付け用）
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      /* クリップボードが使えない環境では無視 */
    }

    const subject = encodeURIComponent('【料金シミュレーター】お見積もりのご相談')
    const body = encodeURIComponent(summary)
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
  }, [buildSummary])

  const options = [
    { key: 'wordpress', state: wordpress, set: setWordpress },
    { key: 'form', state: form, set: setForm },
    { key: 'complex', state: complex, set: setComplex },
  ]

  return (
    <div className="ps">
      {/* ── モード切替（fixedMode指定時は非表示） ── */}
      {!fixedMode && (
        <div className="ps-mode" role="group" aria-label="属性を選択">
          <button
            className={`ps-mode__btn${mode === 'direct' ? ' ps-mode__btn--active' : ''}`}
            onClick={() => setMode('direct')}
            aria-pressed={mode === 'direct'}
          >
            エンドユーザー（直請け）
          </button>
          <button
            className={`ps-mode__btn${mode === 'partner' ? ' ps-mode__btn--active' : ''}`}
            onClick={() => setMode('partner')}
            aria-pressed={mode === 'partner'}
          >
            制作会社（パートナー）
          </button>
        </div>
      )}

      {/* ── 制作種別 ── */}
      <div className="ps-section">
        <span className="ps-section__label">制作種別</span>
        <div className="ps-type" role="group" aria-label="制作種別を選択">
          {(['lp', 'hp'] as ProjectType[]).map((t) => (
            <label
              key={t}
              className={`ps-type__option${type === t ? ' ps-type__option--active' : ''}`}
            >
              <input
                type="radio"
                name="ps-type"
                value={t}
                checked={type === t}
                onChange={() => setType(t)}
                className="ps-sr-only"
              />
              {t === 'lp' ? 'LP制作' : 'HP制作'}
            </label>
          ))}
        </div>
      </div>

      {/* ── 詳細項目 ── */}
      <div className="ps-section">
        <span className="ps-section__label">詳細項目</span>
        <ul className="ps-items" role="list">
          {/* ── 固定項目 ── */}
          {type === 'lp' ? (
            <li className="ps-item">
              <div className="ps-item__left">
                <span className="ps-item__name">{PRICES.lp.label}</span>
                <InfoIcon tooltip={PRICES.lp.tooltip} />
              </div>
              <span className="ps-item__price">¥{fmt(price('lp'))}</span>
            </li>
          ) : (
            <>
              <li className="ps-item">
                <div className="ps-item__left">
                  <span className="ps-item__name">{PRICES.hpTop.label}</span>
                  <InfoIcon tooltip={PRICES.hpTop.tooltip} />
                </div>
                <span className="ps-item__price">¥{fmt(price('hpTop'))}</span>
              </li>
              <li className="ps-item ps-item--stepper">
                <div className="ps-item__left">
                  <span className="ps-item__name">{PRICES.hpSub.label}</span>
                  <InfoIcon tooltip={PRICES.hpSub.tooltip} />
                </div>
                <div className="ps-item__right">
                  <div className="ps-stepper">
                    <button
                      type="button"
                      className="ps-stepper__btn"
                      onClick={() => setSubPages((p) => Math.max(0, p - 1))}
                      aria-label="1枚減らす"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      className="ps-stepper__input"
                      value={subPages}
                      min={0}
                      onChange={(e) =>
                        setSubPages(
                          Math.max(0, parseInt(e.target.value, 10) || 0)
                        )
                      }
                      aria-label="下層ページ数"
                    />
                    <span className="ps-stepper__unit">枚</span>
                    <button
                      type="button"
                      className="ps-stepper__btn"
                      onClick={() => setSubPages((p) => p + 1)}
                      aria-label="1枚増やす"
                    >
                      ＋
                    </button>
                  </div>
                  <span className="ps-item__price">
                    ¥{fmt(price('hpSub') * subPages)}
                  </span>
                </div>
              </li>
            </>
          )}

          {/* ── デザイン制作オプション（直請けのみ表示） ── */}
          {mode === 'direct' && (
            <li
              className={`ps-item ps-item--opt${design ? ' ps-item--checked' : ''}`}
            >
              <label className="ps-item__check-label">
                <input
                  type="checkbox"
                  checked={design}
                  onChange={(e) => setDesign(e.target.checked)}
                  className="ps-checkbox"
                />
                <span className="ps-checkbox__box" aria-hidden="true" />
                <span className="ps-item__name">デザインもお任せ</span>
                <InfoIcon tooltip="デザイン制作の目安料金です（LP: 80,000円／HP: トップ50,000円＋下層10,000円/枚）。内容やボリュームにより前後しますので、正式なお見積りでご提示します。デザインデータをお持ちの場合は不要です。" />
              </label>
              <span
                className={`ps-item__price${!design ? ' ps-item__price--muted' : ''}`}
              >
                ¥{fmt(designPrice)}
              </span>
            </li>
          )}

          {/* ── オプション（チェックボックス）── */}
          {options.map(({ key, state, set }) => (
            <li
              key={key}
              className={`ps-item ps-item--opt${state ? ' ps-item--checked' : ''}`}
            >
              <label className="ps-item__check-label">
                <input
                  type="checkbox"
                  checked={state}
                  onChange={(e) => set(e.target.checked)}
                  className="ps-checkbox"
                />
                <span className="ps-checkbox__box" aria-hidden="true" />
                <span className="ps-item__name">{PRICES[key].label}</span>
                <InfoIcon tooltip={PRICES[key].tooltip} />
              </label>
              <span
                className={`ps-item__price${!state ? ' ps-item__price--muted' : ''}`}
              >
                ¥{fmt(price(key))}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── 合計 ── */}
      <div className="ps-total">
        <div className="ps-total__label">概算合計（税込）</div>
        <div className="ps-total__amount">
          <span className="ps-total__currency">¥</span>
          <span className="ps-total__number">{fmt(total)}</span>
          <span className="ps-total__tilde">〜</span>
        </div>
        <p className="ps-total__note">
          概算のため、詳細はお問い合わせにてご確認ください。
        </p>
      </div>

      {/* ── お問い合わせボタン ── */}
      <div className="ps-action">
        <button
          type="button"
          className="ps-contact-btn"
          onClick={handleContact}
        >
          {copied ? '内容をコピーしました（メールを開いています）' : 'この内容でお問い合わせ'}
          <svg
            className="ps-contact-btn__icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
