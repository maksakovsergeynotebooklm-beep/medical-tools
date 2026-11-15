"use strict";
// v3.7.1: компактный интерфейс; математические модели без изменений.

    const state = {
      results: {
        bmi: null, egfr: null, egfrcys: null, mentzer: null, tsat: null,
        score2: null, score2op: null, score2diabetes: null, prevent: null, cadptp: null, dlcn: null, afstroke: null,
        hasbled: null, grace: null, precisedapt: null, qtc: null, vte: null,
        pneumonia: null, sorethroat: null, electrolytes: null, fib4: null,
        maf5: null, liverpro: null, adapt: null, stopbang: null, epworth: null,
        frax: null, phq9: null, gad7: null, mmse: null
      }
    };

    function parseNumber(value) {
      if (typeof value !== "string") return NaN;
      const normalized = value
        .trim()
        .replace(/[−–—]/g, "-")
        .replace(/[\u00a0\u202f]/g, " ");
      const localizedDecimal = /^[+-]?(?:(?:\d{1,3}(?: \d{3})+|\d+)(?:[.,]\d+)?|[.,]\d+)$/;
      if (!localizedDecimal.test(normalized)) return NaN;
      return Number(normalized.replace(/ /g, "").replace(",", "."));
    }

    const numberFormatters = new Map();

    function formatNumber(value, digits = 1) {
      if (!numberFormatters.has(digits)) {
        numberFormatters.set(digits, new Intl.NumberFormat("ru-RU", {
          minimumFractionDigits: digits,
          maximumFractionDigits: digits
        }));
      }
      return numberFormatters.get(digits).format(value);
    }

    function setResult(key, valueText, interpretation, tone, note, copyText) {
      const result = document.getElementById(key + "Result");
      const interpretationEl = document.getElementById(key + "Interpretation");
      const noteEl = document.getElementById(key + "Note");
      const copyButton = document.querySelector('[data-copy="' + key + '"]');

      result.textContent = valueText;
      interpretationEl.textContent = interpretation;
      interpretationEl.className = "result-interpretation" + (tone ? " " + tone : "");
      noteEl.textContent = note || "";

      state.results[key] = copyText || null;
      copyButton.disabled = !copyText;
      copyButton.closest(".result-box").dataset.ready = copyText ? "true" : "false";
      if (copyText) window.PatientSharing.markResultReady(copyText + (note ? "\n" + note : ""));
      else window.PatientSharing.resetResult();
    }

    function setError(key, message) {
      const error = document.getElementById(key + "Error");
      if (message) {
        clearResult(key, "Исправьте исходные данные.");
        resetAuxiliaryMetrics(key);
        error.textContent = message;
      } else {
        error.textContent = "";
      }
    }

    function clearResult(key, message) {
      const defaultNotes = {
        bmi: "Категории предназначены для скрининговой оценки взрослых и не отражают состав тела.",
        egfr: "Одно значение СКФ не устанавливает диагноз ХБП. Важны повторные измерения, длительность изменений и альбуминурия.",
        mentzer: "Это ориентир при микроцитозе, а не самостоятельный диагностический тест.",
        tsat: "Интерпретируйте вместе с ферритином, воспалительными маркерами и клиническим контекстом; референсы лабораторий различаются.",
        score2: "Для возраста 40–69 лет при соблюдении условий применимости. С 70 лет используйте SCORE2-OP.",
        score2op: "Для возраста 70–89 лет без ССЗ, диабета, ХБП и генетических нарушений липидов/АД.",
        score2diabetes: "СД 2 типа, 40–69 лет, без атеросклеротического ССЗ и тяжёлого поражения органов-мишеней.",
        prevent: "Total CVD включает ASCVD и сердечную недостаточность. Используется базовая модель без дополнительных предикторов.",
        phq9: "Скрининговая шкала не устанавливает диагноз. Положительный ответ на пункт 9 требует отдельной оценки безопасности.",
        gad7: "Скрининговая шкала отражает выраженность симптомов, но не заменяет клиническую диагностику.",
        mmse: "Результат зависит от возраста, образования, языка, слуха, зрения, моторных ограничений и условий проведения.",
        fib4: "Точность ниже в возрасте до 35 лет; после 65 лет используется более высокий нижний порог.",
        maf5: "Возраст не входит в формулу. Шкала разрабатывалась для популяции с метаболической дисфункцией.",
        liverpro: "Алгоритм не рассчитывается локально: доступна интерпретация готовой сертифицированной вероятности.",
        adapt: "Используйте только значение Elecsys PRO-C3: результаты других методов нельзя подставлять в эту версию.",
        stopbang: "Шкала оценивает вероятность СОАС, но не подтверждает диагноз.",
        epworth: "Шкала оценивает субъективную дневную сонливость, но не определяет её причину.",
        afstroke: "Балльная шкала не заменяет оценку показаний, противопоказаний и предпочтений пациента.",
        vte: "Алгоритмы применяются только в соответствующем клиническом контексте.",
        pneumonia: "Шкала дополняет клиническую оценку тяжести пневмонии.",
        sorethroat: "Решение об антибиотике зависит от клинической ситуации и локальных рекомендаций.",
        qtc: "Bazett может искажать результат при выраженной тахикардии или брадикардии.",
        electrolytes: "Расчётные показатели необходимо сопоставлять с методом лаборатории и клинической ситуацией.",
        grace: "Балльная модель поддерживает стратификацию риска, но не должна задерживать неотложное лечение.",
        hasbled: "Высокий балл не является самостоятельной причиной отказа от антикоагуляции.",
        cadptp: "Базовая модель не учитывает факторы риска и коронарный кальций.",
        dlcn: "Используйте нелеченое значение LDL-C.",
        precisedapt: "Порог ≥25 указывает на высокий риск кровотечения.",
        frax: "10-летняя вероятность зависит от страны и рассчитывается в официальной модели.",
        egfrcys: "Одно значение СКФ не устанавливает диагноз ХБП. Учитывайте альбуминурию, хронический характер изменений и факторы, влияющие на оба маркера."
      };
      setResult(key, "—", message, "", defaultNotes[key], null);
      setError(key, "");
    }

    function calculateMentzer() {
      setError("mentzer", "");
      const mcv = parseNumber(document.getElementById("mentzerMcv").value);
      const rbc = parseNumber(document.getElementById("mentzerRbc").value);

      if (!Number.isFinite(mcv) || !Number.isFinite(rbc)) {
        setError("mentzer", "Заполните MCV и число эритроцитов.");
        return false;
      }
      if (mcv <= 0 || rbc <= 0) {
        setError("mentzer", "Оба показателя должны быть больше нуля.");
        return false;
      }
      if (mcv < 30 || mcv > 150 || rbc < 1 || rbc > 10) {
        setError("mentzer", "Проверьте значения и единицы измерения.");
        return false;
      }

      const index = mcv / rbc;
      let interpretation = "";
      let tone = "";

      if (index < 13) {
        interpretation = "Результат больше соответствует носительству β-талассемии.";
        tone = "warning";
      } else if (index > 13) {
        interpretation = "Результат больше соответствует железодефицитной анемии.";
        tone = "warning";
      } else {
        interpretation = "Пограничный результат около диагностического порога 13.";
        tone = "warning";
      }

      const valueText = formatNumber(index, 1);
      setResult(
        "mentzer",
        valueText,
        interpretation,
        tone,
        "Индекс применим как ориентир при микроцитозе и не заменяет лабораторное подтверждение.",
        "Индекс Ментцера: " + valueText + ". " + interpretation
      );
      return true;
    }

    function ironToUmol(value, unit) {
      return unit === "ugdl" ? value * 0.17906 : value;
    }

    function calculateTsat() {
      setError("tsat", "");
      const mode = document.querySelector('input[name="tsatMode"]:checked').value;
      let tsat;

      if (mode === "tibc") {
        const ironRaw = parseNumber(document.getElementById("tsatIronTibc").value);
        const tibcRaw = parseNumber(document.getElementById("tsatTibc").value);
        const ironUnit = document.getElementById("tsatIronTibcUnit").value;
        const tibcUnit = document.getElementById("tsatTibcUnit").value;

        if (!Number.isFinite(ironRaw) || !Number.isFinite(tibcRaw)) {
          setError("tsat", "Заполните сывороточное железо и ОЖСС.");
          return false;
        }
        if (ironRaw <= 0 || tibcRaw <= 0) {
          setError("tsat", "Оба показателя должны быть больше нуля.");
          return false;
        }

        const ironUmol = ironToUmol(ironRaw, ironUnit);
        const tibcUmol = ironToUmol(tibcRaw, tibcUnit);
        tsat = (ironUmol / tibcUmol) * 100;
      } else {
        const ironRaw = parseNumber(document.getElementById("tsatIronTf").value);
        const transferrinRaw = parseNumber(document.getElementById("tsatTransferrin").value);
        const ironUnit = document.getElementById("tsatIronTfUnit").value;
        const transferrinUnit = document.getElementById("tsatTransferrinUnit").value;

        if (!Number.isFinite(ironRaw) || !Number.isFinite(transferrinRaw)) {
          setError("tsat", "Заполните сывороточное железо и трансферрин.");
          return false;
        }
        if (ironRaw <= 0 || transferrinRaw <= 0) {
          setError("tsat", "Оба показателя должны быть больше нуля.");
          return false;
        }

        const ironUmol = ironToUmol(ironRaw, ironUnit);
        const transferrinGl = transferrinUnit === "mgdl" ? transferrinRaw * 0.01 : transferrinRaw;
        tsat = (ironUmol * 3.98) / transferrinGl;
      }

      if (!Number.isFinite(tsat) || tsat <= 0 || tsat > 100) {
        setError("tsat", "Получено неправдоподобное значение. Проверьте показатели и единицы.");
        return false;
      }

      let interpretation = "";
      let tone = "";

      if (tsat < 20) {
        interpretation = "Сниженное насыщение трансферрина; возможно ограничение доступности железа.";
        tone = "warning";
      } else if (tsat <= 45) {
        interpretation = "Ориентировочно в распространённом референсном диапазоне.";
        tone = "good";
      } else {
        interpretation = "Повышенное насыщение трансферрина; оцените клинический контекст и повторяемость результата.";
        tone = "warning";
      }

      const valueText = formatNumber(tsat, 1);
      setResult(
        "tsat",
        valueText,
        interpretation,
        tone,
        "Пороговые значения зависят от клинической задачи и лаборатории.",
        "Насыщение трансферрина: " + valueText + "%. " + interpretation
      );
      return true;
    }


    function cholesterolToMmol(value, unit) {
      return unit === "mgdl" ? value * 0.02586 : value;
    }

    function cholesterolToMgdl(value, unit) {
      return unit === "mmol" ? value / 0.02586 : value;
    }

    // Country clusters: ESC Prevention Guidelines 2021, Figure 3.
    // https://doi.org/10.1093/eurheartj/ehab484
    const SCORE2_COUNTRIES = {
      RU: ["Россия", "veryHigh"], BY: ["Беларусь", "veryHigh"],
      KZ: ["Казахстан", "high"],
      AT: ["Австрия", "moderate"], AZ: ["Азербайджан", "veryHigh"],
      AL: ["Албания", "high"], DZ: ["Алжир", "veryHigh"],
      AM: ["Армения", "veryHigh"], BE: ["Бельгия", "low"],
      BG: ["Болгария", "veryHigh"], BA: ["Босния и Герцеговина", "high"],
      GB: ["Великобритания", "low"], HU: ["Венгрия", "high"],
      DE: ["Германия", "moderate"], GR: ["Греция", "moderate"],
      GE: ["Грузия", "veryHigh"], DK: ["Дания", "low"],
      EG: ["Египет", "veryHigh"], IL: ["Израиль", "low"],
      IE: ["Ирландия", "moderate"], IS: ["Исландия", "moderate"],
      ES: ["Испания", "low"], IT: ["Италия", "moderate"],
      CY: ["Кипр", "moderate"], KG: ["Кыргызстан", "veryHigh"],
      LV: ["Латвия", "veryHigh"], LB: ["Ливан", "veryHigh"],
      LY: ["Ливия", "veryHigh"], LT: ["Литва", "veryHigh"],
      LU: ["Люксембург", "low"], MT: ["Мальта", "moderate"],
      MA: ["Марокко", "veryHigh"], MD: ["Молдова", "veryHigh"],
      NL: ["Нидерланды", "low"], NO: ["Норвегия", "low"],
      PL: ["Польша", "high"], PT: ["Португалия", "moderate"],
      RO: ["Румыния", "veryHigh"], SM: ["Сан-Марино", "moderate"],
      MK: ["Северная Македония", "veryHigh"], RS: ["Сербия", "veryHigh"],
      SY: ["Сирия", "veryHigh"], SK: ["Словакия", "high"],
      SI: ["Словения", "moderate"], TN: ["Тунис", "veryHigh"],
      TR: ["Турция", "high"], UZ: ["Узбекистан", "veryHigh"],
      UA: ["Украина", "veryHigh"], FI: ["Финляндия", "moderate"],
      FR: ["Франция", "low"], HR: ["Хорватия", "high"],
      ME: ["Черногория", "veryHigh"], CZ: ["Чехия", "high"],
      CH: ["Швейцария", "low"], SE: ["Швеция", "moderate"],
      EE: ["Эстония", "high"]
    };
    const SCORE2_REGION_NAMES = {
      low: "низкий", moderate: "умеренный", high: "высокий", veryHigh: "очень высокий"
    };

    const SCORE2_DIABETES_CALIBRATION = {
      low: { male: [-0.5699, 0.7476], female: [-0.7380, 0.7019] },
      moderate: { male: [-0.1565, 0.8009], female: [-0.3143, 0.7701] },
      high: { male: [0.3207, 0.9360], female: [0.5710, 0.9369] },
      veryHigh: { male: [0.5836, 0.8294], female: [0.9412, 0.8329] }
    };

    function calibratedScoreRisk(lp, survival, scales) {
      // Algebraically equivalent to the published two-stage transformation;
      // avoids cancellation when 1 - baseRisk is very close to 0 or 1.
      return -100 * Math.expm1(-Math.exp(scales[0] + scales[1] * (Math.log(-Math.log(survival)) + lp)));
    }

    function hba1cToIfcc(value, unit) {
      // NGSP master equation: NGSP (%) = 0.09148 * IFCC (mmol/mol) + 2.152.
      return unit === "percent" ? (value - 2.152) / 0.09148 : value;
    }

    function score2DiabetesRisk({ age, sex, smoking, sbp, tc, hdl, region, diagnosisAge, hba1c, egfr }) {
      const a = (age-60)/5, s = (sbp-120)/20, t = tc-6, h = (hdl-1.3)/0.5;
      const d = (diagnosisAge-50)/5, b = (hba1c-31)/9.34, g = (Math.log(egfr)-4.5)/0.15;
      const female = sex === "female";
      const lp = female
        ? 0.6624*a + 0.6139*smoking + 0.1421*s + 0.8096 + 0.1127*t - 0.1568*h
          - 0.1122*a*smoking - 0.0167*a*s - 0.1272*a - 0.0200*a*t + 0.0186*a*h
          - 0.1180*d + 0.1173*b - 0.0640*g + 0.0062*g*g - 0.0196*a*b + 0.0169*a*g
        : 0.5368*a + 0.4774*smoking + 0.1322*s + 0.6457 + 0.1102*t - 0.1087*h
          - 0.0672*a*smoking - 0.0268*a*s - 0.0983*a - 0.0181*a*t + 0.0095*a*h
          - 0.0998*d + 0.0955*b - 0.0591*g + 0.0058*g*g - 0.0134*a*b + 0.0115*a*g;
      return calibratedScoreRisk(lp, female ? 0.9776 : 0.9605, SCORE2_DIABETES_CALIBRATION[region][sex]);
    }

    function score2DiabetesCategory(percent) {
      if (percent < 5) return ["Низкий риск.", "good"];
      if (percent < 10) return ["Умеренный риск.", "warning"];
      if (percent < 20) return ["Высокий риск.", "warning"];
      return ["Очень высокий риск.", "danger"];
    }

    function calculateExtendedScore2(key) {
      setError(key, "");
      const value = suffix => document.getElementById(key + suffix).value;
      const fail = message => { setError(key, message); return false; };
      const diabetes = key === "score2diabetes";
      const name = diabetes ? "SCORE2-Diabetes" : "SCORE2-OP";
      if (value("Eligibility") !== "eligible") return fail(diabetes
        ? "Подтвердите СД 2 типа без атеросклеротического ССЗ и тяжёлого поражения органов-мишеней. При этих состояниях риск определяют без SCORE2-Diabetes."
        : "SCORE2-OP здесь применяется только без ССЗ, диабета, ХБП и генетических нарушений липидов/АД. Подтвердите применимость.");
      const sex = document.querySelector('input[name="' + key + 'Sex"]:checked')?.value;
      const smokingValue = document.querySelector('input[name="' + key + 'Smoking"]:checked')?.value;
      const country = value("Country");
      const region = country === "manual" ? value("Region") : SCORE2_COUNTRIES[country]?.[1];
      const age = parseNumber(value("Age")), sbp = parseNumber(value("Sbp"));
      const tc = cholesterolToMmol(parseNumber(value("Tc")), value("TcUnit"));
      const hdl = cholesterolToMmol(parseNumber(value("Hdl")), value("HdlUnit"));
      if (![age, sbp, tc, hdl].every(Number.isFinite) || !["male", "female"].includes(sex) || !["0", "1"].includes(smokingValue) || !SCORE2_REGION_NAMES[region]) {
        return fail("Укажите возраст, пол, курение, страну, АД, общий холестерин и ЛПВП.");
      }
      const minAge = diabetes ? 40 : 70, maxAge = diabetes ? 69 : 89;
      if (!Number.isInteger(age) || age < minAge || age > maxAge) return fail(name + ": возраст в полных годах от " + minAge + " до " + maxAge + ". Не используйте экстраполяцию за эти пределы.");
      if (sbp < 80 || sbp > 240 || tc < 2 || tc > 12 || hdl < 0.3 || hdl > 4 || hdl >= tc) return fail("Проверьте АД, показатели холестерина и единицы измерения.");
      const input = { age, sex, smoking: Number(smokingValue), sbp, tc, hdl, region };
      let extra = "";
      if (diabetes) {
        input.diagnosisAge = parseNumber(value("DiagnosisAge"));
        input.hba1c = hba1cToIfcc(parseNumber(value("Hba1c")), value("Hba1cUnit"));
        input.egfr = parseNumber(value("Egfr"));
        if (!Number.isInteger(input.diagnosisAge) || input.diagnosisAge < 1 || input.diagnosisAge > age) return fail("Введите возраст диагностики СД 2 типа в полных годах: он не может превышать текущий возраст.");
        if (!Number.isFinite(input.hba1c) || input.hba1c < 15 || input.hba1c > 195) return fail("Проверьте HbA1c и единицы: допустимый ввод 15–195 ммоль/моль (примерно 3,5–20%).");
        if (!Number.isFinite(input.egfr) || input.egfr <= 0 || input.egfr > 150) return fail("Укажите СКФ CKD-EPI 2009 по креатинину, мл/мин/1,73 м². Допустимый ввод: больше 0 и не выше 150.");
        if (input.egfr < 45) return fail("СКФ <45 мл/мин/1,73 м² — тяжёлое поражение органов-мишеней по ESC 2023. Категорию риска определяют без SCORE2-Diabetes.");
        const uacr = value("UacrCategory");
        if (!["a1", "a2", "a3"].includes(uacr)) return fail("Укажите категорию альбуминурии: без неё нельзя исключить тяжёлое поражение почек.");
        if (uacr === "a3" || (input.egfr < 60 && uacr === "a2")) return fail("Указанные СКФ и альбуминурия соответствуют тяжёлому поражению органов-мишеней по ESC 2023. SCORE2-Diabetes не применяется.");
        extra = " Диагноз СД2 в " + input.diagnosisAge + " лет; HbA1c " + formatNumber(input.hba1c, 1) + " ммоль/моль; СКФ CKD-EPI 2009 " + formatNumber(input.egfr, 1) + " мл/мин/1,73 м²; альбуминурия " + uacr.toUpperCase() + ".";
      }
      const percent = diabetes ? score2DiabetesRisk(input) : score2OpRisk(input);
      if (!Number.isFinite(percent) || percent < 0 || percent > 100) return fail("Расчёт недоступен: проверьте исходные данные.");
      const guideline = diabetes ? "diabetes2023" : value("Guideline");
      const [category, tone] = diabetes ? score2DiabetesCategory(percent) : score2Category(percent, age, guideline);
      const version = diabetes ? "ESC 2023 · диабет" : guideline === "lipids2025" ? "ESC/EAS 2025 · липиды" : "ESC 2021 · профилактика";
      const context = (SCORE2_COUNTRIES[country]?.[0] || "Регион выбран вручную") + "; региональный риск: " + SCORE2_REGION_NAMES[region] + ".";
      const markedRisk = sbp >= 180 || tc > 8;
      const warning = markedRisk ? " Выраженное повышение АД или холестерина требует отдельной оценки независимо от процента." : "";
      const interpretation = (markedRisk ? "Есть независимо значимый фактор риска." : category) + " " + version + ".";
      const formatted = formatNumber(percent, 1);
      setResult(key, formatted, interpretation, markedRisk ? "warning" : tone,
        context + " Не-ЛПВП: " + formatNumber(tc-hdl, 2) + " ммоль/л. Категория до округления." + warning,
        name + ": " + formatted + "% за 10 лет. " + interpretation + " " + context + " " + age + " лет; " +
        (sex === "female" ? "женщина" : "мужчина") + "; " + (input.smoking ? "курит" : "не курит") +
        "; САД " + sbp + " мм рт. ст.; ОХС " + formatNumber(tc, 2) + "; ЛПВП " + formatNumber(hdl, 2) + " ммоль/л." + extra + warning);
      return true;
    }

    function readSelectValues(prefix, count) {
      const values = [];
      for (let i = 1; i <= count; i += 1) {
        const element = document.getElementById(prefix + i);
        if (!element || element.value === "") return null;
        const value = Number(element.value);
        if (!Number.isFinite(value)) return null;
        values.push(value);
      }
      return values;
    }

    function sumSelectValues(prefix, count) {
      const values = readSelectValues(prefix, count);
      return values ? values.reduce((total, value) => total + value, 0) : null;
    }

    function calculateMmse() {
      setError("mmse", "");

      const points = Array.from(document.querySelectorAll("#mmseForm .mmse-point"));
      if (points.length !== 30) {
        setError("mmse", "Не удалось проверить структуру формы MMSE.");
        return false;
      }

      const total = points.reduce((sum, input) => sum + (input.checked ? 1 : 0), 0);
      let interpretation, tone;

      if (total >= 24) {
        interpretation = "Выраженное когнитивное снижение по суммарному баллу менее вероятно.";
        tone = "good";
      } else if (total >= 20) {
        interpretation = "Возможное лёгкое когнитивное снижение.";
        tone = "warning";
      } else if (total >= 10) {
        interpretation = "Возможное умеренное когнитивное снижение.";
        tone = "warning";
      } else {
        interpretation = "Выраженное снижение по суммарному результату.";
        tone = "danger";
      }

      setResult(
        "mmse",
        String(total),
        interpretation,
        tone,
        "Интерпретируйте результат с учётом образования, языка, слуха, зрения, моторных ограничений, делирия и депрессии.",
        "MMSE: " + total + "/30. " + interpretation
      );
      return true;
    }

    function calculateMaf5() {
      setError("maf5", "");
      const waistRaw = parseNumber(document.getElementById("maf5Waist").value);
      const waistUnit = document.getElementById("maf5WaistUnit").value;
      const waist = waistUnit === "in" ? waistRaw * 2.54 : waistRaw;
      const bmi = parseNumber(document.getElementById("maf5Bmi").value);
      const ast = parseNumber(document.getElementById("maf5Ast").value);
      const platelets = parseNumber(document.getElementById("maf5Platelets").value);
      const diabetes = Number(document.querySelector('input[name="maf5Diabetes"]:checked').value);
      if (![waist,bmi,ast,platelets].every(Number.isFinite)) {
        setError("maf5", "Заполните окружность талии, ИМТ, АСТ и тромбоциты.");
        return false;
      }
      if (waist < 40 || waist > 220 || bmi < 10 || bmi > 80 || ast <= 0 || platelets <= 0) {
        setError("maf5", "Проверьте исходные значения.");
        return false;
      }
      const score = -11.3674 + waist*0.0282 - bmi*0.1761 + waist*bmi*0.0019 + diabetes*2.0762 + Math.log(ast)*2.9207 - platelets*0.0059;
      let interpretation, tone;
      if (score < 0) { interpretation = "Низкий риск фиброза."; tone = "good"; }
      else if (score < 1) { interpretation = "Промежуточный риск фиброза."; tone = "warning"; }
      else { interpretation = "Высокий риск фиброза."; tone = "danger"; }
      const valueText = formatNumber(score, 2);
      setResult("maf5", valueText, interpretation, tone, "Результат следует сопоставлять с клинической вероятностью и методами второй линии.", "MAF-5: " + valueText + ". " + interpretation);
      return true;
    }

    function calculateLiverpro() {
      setError("liverpro", "");
      const value = parseNumber(document.getElementById("liverproValue").value);
      if (!Number.isFinite(value) || value < 0 || value > 100) {
        setError("liverpro", "Введите вероятность от 0 до 100%.");
        return false;
      }
      let interpretation, tone;
      if (value < 25) { interpretation = "Rule-out: низкая вероятность клинически значимого фиброза."; tone = "good"; }
      else if (value <= 65) { interpretation = "Промежуточная зона — требуется дальнейшая оценка."; tone = "warning"; }
      else { interpretation = "Rule-in: высокая вероятность клинически значимого фиброза."; tone = "danger"; }
      const valueText = formatNumber(value, 1);
      setResult("liverpro", valueText, interpretation, tone, "Это интерпретация готового результата, а не независимый расчёт LiverPRO.", "LiverPRO: " + valueText + "%. " + interpretation);
      return true;
    }

    function calculateAdapt() {
      setError("adapt", "");
      const age = parseNumber(document.getElementById("adaptAge").value);
      const proc3 = parseNumber(document.getElementById("adaptProc3").value);
      const platelets = parseNumber(document.getElementById("adaptPlatelets").value);
      const diabetes = Number(document.querySelector('input[name="adaptDiabetes"]:checked').value);
      if (![age,proc3,platelets].every(Number.isFinite)) {
        setError("adapt", "Заполните возраст, PRO-C3 и тромбоциты.");
        return false;
      }
      if (age < 18 || age > 100 || proc3 <= 0 || proc3 > 500 || platelets < 5 || platelets > 3500) {
        setError("adapt", "Проверьте диапазоны исходных данных.");
        return false;
      }
      const effectiveProc3 = Math.max(proc3, 20);
      const score = Math.exp(Math.log10((age * effectiveProc3) / Math.sqrt(platelets))) + diabetes;
      let interpretation, tone;
      if (score < 9) { interpretation = "Нет или лёгкий фиброз (F0–F1)."; tone = "good"; }
      else if (score < 10) { interpretation = "Риск как минимум значимого фиброза (F2–F4)."; tone = "warning"; }
      else if (score < 11) { interpretation = "Риск продвинутого фиброза (F3–F4)."; tone = "danger"; }
      else { interpretation = "Высокий риск цирроза (F4)."; tone = "danger"; }
      const valueText = formatNumber(score, 3);
      setResult("adapt", valueText, interpretation, tone, proc3 < 20 ? "Значение PRO-C3 ниже LoQ автоматически установлено равным 20 нг/мл." : "Интерпретируйте вместе с другими методами согласно клиническим рекомендациям.", "ADAPT: " + valueText + ". " + interpretation);
      return true;
    }

    function calculateStopbang() {
      setError("stopbang", "");
      const answers = readSelectValues("stopbang", 8);
      if (!answers) {
        setError("stopbang", "Ответьте на все восемь вопросов.");
        return false;
      }
      const score = answers.reduce((total, value) => total + value, 0);
      const stopSubtotal = answers.slice(0, 4).reduce((total, value) => total + value, 0);
      const highRiskCombination = stopSubtotal >= 2 && Boolean(answers[4] || answers[6] || answers[7]);
      let interpretation, tone;
      if (score <= 2) { interpretation = "Низкий риск обструктивного апноэ сна."; tone = "good"; }
      else if (score >= 5 || highRiskCombination) { interpretation = "Высокий риск обструктивного апноэ сна."; tone = "danger"; }
      else { interpretation = "Промежуточный риск обструктивного апноэ сна."; tone = "warning"; }
      setResult("stopbang", String(score), interpretation, tone, "Результат определяет необходимость дальнейшей клинической оценки, но не заменяет исследование сна.", "STOP-Bang: " + score + "/8. " + interpretation);
      return true;
    }

    function calculateEpworth() {
      setError("epworth", "");

      const answers = [];
      for (let i = 1; i <= 8; i += 1) {
        const value = document.getElementById("epworth" + i).value;
        if (value === "") {
          setError("epworth", "Ответь на все восемь вопросов.");
          return false;
        }
        answers.push(Number(value));
      }

      const score = answers.reduce((sum, value) => sum + value, 0);
      let interpretation, tone;

      if (score <= 10) {
        interpretation = "Обычный диапазон дневной сонливости.";
        tone = "good";
      } else if (score <= 12) {
        interpretation = "Лёгкая чрезмерная дневная сонливость.";
        tone = "warning";
      } else if (score <= 15) {
        interpretation = "Умеренная чрезмерная дневная сонливость.";
        tone = "warning";
      } else {
        interpretation = "Выраженная чрезмерная дневная сонливость.";
        tone = "danger";
      }

      setResult(
        "epworth",
        String(score),
        interpretation,
        tone,
        "Оцените длительность сна, лекарства, циркадные факторы, симптомы апноэ и другие возможные причины сонливости.",
        "Шкала сонливости Эпворта: " + score + "/24. " + interpretation
      );
      return true;
    }


    function countChecked(ids, values) {
      return ids.reduce((sum, id, index) => sum + (document.getElementById(id).checked ? values[index] : 0), 0);
    }

    function calculateAfstroke() {
      setError("afstroke", "");
      const age = parseNumber(document.getElementById("afAge").value);
      const sex = document.querySelector('input[name="afSex"]:checked');
      if (!Number.isFinite(age) || age < 18 || age > 120 || !sex) {
        setError("afstroke", "Укажите корректный возраст и пол.");
        return false;
      }
      let va = 0;
      if (document.getElementById("afChf").checked) va += 1;
      if (document.getElementById("afHtn").checked) va += 1;
      if (document.getElementById("afDiabetes").checked) va += 1;
      if (document.getElementById("afStroke").checked) va += 2;
      if (document.getElementById("afVascular").checked) va += 1;
      if (age >= 75) va += 2;
      else if (age >= 65) va += 1;
      const vasc = va + (sex.value === "female" ? 1 : 0);
      let text, tone;
      if (va === 0) { text = "Факторы риска по шкале отсутствуют."; tone = "good"; }
      else if (va === 1) { text = "Один фактор риска: требуется индивидуальная оценка профилактики инсульта."; tone = "warning"; }
      else { text = "Несколько факторов риска: обсудите стратегию профилактики инсульта."; tone = "warning"; }
      setResult("afstroke", String(va), text + " CHA₂DS₂-VASc: " + vasc + ".", tone,
        "Баллы отражают только клинические факторы риска и не оценивают риск кровотечения.",
        "CHA₂DS₂-VA: " + va + "; CHA₂DS₂-VASc: " + vasc + ".");
      return true;
    }

    function setModePanels(selector, map, value) {
      Object.entries(map).forEach(([mode, id]) => {
        const panel = document.getElementById(id);
        if (panel) panel.hidden = mode !== value;
      });
    }

    function calculateVte() {
      setError("vte", "");
      const mode = document.querySelector('input[name="vteMode"]:checked').value;
      const unitEl = document.getElementById("vteResultUnit");
      let valueText = "", interpretation = "", tone = "", note = "", copy = "";

      if (mode === "pe") {
        const score =
          countChecked(["vtePeDvtSigns","vtePeAltLess","vtePeHr","vtePeImmobil","vtePePrevious","vtePeHemoptysis","vtePeCancer"],
                       [3,3,1.5,1.5,1.5,1,1]);
        valueText = formatNumber(score, score % 1 ? 1 : 0);
        unitEl.textContent = "баллов";
        if (score > 4) {
          interpretation = "ТЭЛА вероятна по двухуровневой модели Wells.";
          tone = "danger";
          note = "Обычно требуется немедленная визуализация по принятому диагностическому алгоритму.";
        } else {
          interpretation = "ТЭЛА маловероятна по двухуровневой модели Wells.";
          tone = "warning";
          note = "Обычно следующим этапом является чувствительный D-димер с учётом возраста.";
        }
        copy = "Wells ТЭЛА: " + valueText + ". " + interpretation;
      } else if (mode === "dvt") {
        const score = countChecked(
          ["vteDvtCancer","vteDvtParalysis","vteDvtBed","vteDvtTender","vteDvtWholeLeg","vteDvtCalf","vteDvtPitting","vteDvtCollateral","vteDvtPrevious","vteDvtAlternative"],
          [1,1,1,1,1,1,1,1,1,-2]
        );
        valueText = String(score);
        unitEl.textContent = "баллов";
        if (score >= 2) {
          interpretation = "ТГВ вероятен по двухуровневой модели Wells.";
          tone = "danger";
          note = "Требуется дальнейшее обследование в соответствии с диагностическим алгоритмом.";
        } else {
          interpretation = "ТГВ маловероятен по двухуровневой модели Wells.";
          tone = "warning";
          note = "Обычно следующим этапом является D-димер.";
        }
        copy = "Wells ТГВ: " + score + ". " + interpretation;
      } else if (mode === "perc") {
        const age = parseNumber(document.getElementById("vtePercAge").value);
        const pulse = parseNumber(document.getElementById("vtePercPulse").value);
        const spo2 = parseNumber(document.getElementById("vtePercSpo2").value);
        if (![age,pulse,spo2].every(Number.isFinite) || age < 18 || age > 120 || pulse < 20 || pulse > 250 || spo2 < 40 || spo2 > 100) {
          setError("vte", "Укажите возраст, пульс и SpO₂.");
          return false;
        }
        let positive = 0;
        if (age >= 50) positive++;
        if (pulse >= 100) positive++;
        if (spo2 < 95) positive++;
        positive += countChecked(["vtePercLeg","vtePercHemoptysis","vtePercPrevious","vtePercTrauma","vtePercHormone"], [1,1,1,1,1]);
        valueText = String(positive);
        unitEl.textContent = "положительных критериев";
        if (positive === 0) {
          interpretation = "PERC отрицателен — только при низкой предварительной вероятности ТЭЛА.";
          tone = "good";
        } else {
          interpretation = "PERC положителен: правило не позволяет исключить ТЭЛА без дальнейшего обследования.";
          tone = "warning";
        }
        note = "PERC не предназначен для пациентов со средней или высокой предварительной вероятностью ТЭЛА.";
        copy = "PERC: " + positive + " положительных критериев. " + interpretation;
      } else {
        const age = parseNumber(document.getElementById("vteDdimAge").value);
        const value = parseNumber(document.getElementById("vteDdimValue").value);
        const unit = document.getElementById("vteDdimUnit").value;
        if (!Number.isFinite(age) || !Number.isFinite(value) || age < 18 || age > 120 || value < 0) {
          setError("vte", "Укажите корректный возраст и результат D-димера.");
          return false;
        }
        const threshold = unit === "feu" ? (age > 50 ? age * 10 : 500) : (age > 50 ? age * 5 : 250);
        valueText = formatNumber(threshold, 0);
        unitEl.textContent = unit === "feu" ? "нг/мл FEU — порог" : "нг/мл DDU — порог";
        if (value < threshold) {
          interpretation = "Результат ниже возраст-скорректированного порога.";
          tone = "good";
        } else {
          interpretation = "Результат равен или выше возраст-скорректированного порога.";
          tone = "warning";
        }
        note = "D-димер интерпретируется только вместе с предварительной клинической вероятностью и характеристиками теста.";
        copy = "Возраст-скорректированный порог D-димера: " + valueText + " " + (unit === "feu" ? "нг/мл FEU" : "нг/мл DDU") + ". Результат: " + value + ".";
      }

      setResult("vte", valueText, interpretation, tone, note, copy);
      return true;
    }

    function calculatePneumonia() {
      setError("pneumonia", "");
      const mode = document.querySelector('input[name="pneumoniaMode"]:checked').value;
      const age = parseNumber(document.getElementById("pneuAge").value);
      const rr = parseNumber(document.getElementById("pneuRr").value);
      const sbp = parseNumber(document.getElementById("pneuSbp").value);
      const dbp = parseNumber(document.getElementById("pneuDbp").value);
      if (![age,rr,sbp,dbp].every(Number.isFinite) || age < 16 || age > 120 || rr < 5 || rr > 80 || sbp < 40 || sbp > 260 || dbp < 20 || dbp > 180 || dbp >= sbp) {
        setError("pneumonia", "Заполните возраст, частоту дыхания и артериальное давление.");
        return false;
      }
      let score = 0;
      if (document.getElementById("pneuConfusion").checked) score++;
      if (rr >= 30) score++;
      if (sbp < 90 || dbp <= 60) score++;
      if (age >= 65) score++;
      if (mode === "curb") {
        const ureaRaw = parseNumber(document.getElementById("pneuUrea").value);
        const ureaUnit = document.getElementById("pneuUreaUnit").value;
        if (!Number.isFinite(ureaRaw) || ureaRaw < 0) {
          setError("pneumonia", "Для CURB-65 укажите мочевину или BUN.");
          return false;
        }
        const ureaMmol = ureaUnit === "bun" ? ureaRaw / 2.801 : ureaRaw;
        if (ureaMmol > 80) {
          setError("pneumonia", "Проверьте значение мочевины / BUN и выбранные единицы.");
          return false;
        }
        if (ureaMmol > 7) score++;
      }
      document.getElementById("pneumoniaUnit").textContent = mode === "curb" ? "из 5" : "из 4";
      let interpretation, tone, note;
      if (mode === "crb") {
        if (score === 0) { interpretation = "Низкий риск."; tone = "good"; note = "Обычно возможно амбулаторное ведение при отсутствии других показаний к госпитализации."; }
        else if (score <= 2) { interpretation = "Промежуточный риск."; tone = "warning"; note = score >= 2 ? "Следует рассмотреть направление в стационар." : "Нужна индивидуальная оценка места лечения и наблюдения."; }
        else { interpretation = "Высокий риск."; tone = "danger"; note = "Требуется срочная оценка в стационаре."; }
      } else {
        if (score <= 1) { interpretation = "Низкий риск."; tone = "good"; note = "При клинической стабильности возможно лечение вне стационара."; }
        else if (score === 2) { interpretation = "Промежуточный риск."; tone = "warning"; note = "Рассмотрите наблюдение или стационарное лечение."; }
        else { interpretation = "Высокий риск."; tone = "danger"; note = "Обычно требуется стационарное лечение; оцените необходимость интенсивной терапии."; }
      }
      setResult("pneumonia", String(score), interpretation, tone, note, (mode === "curb" ? "CURB-65" : "CRB-65") + ": " + score + ". " + interpretation);
      return true;
    }

    function calculateSorethroat() {
      setError("sorethroat", "");
      const mode = document.querySelector('input[name="soreMode"]:checked').value;
      let score = 0, max = 5, interpretation = "", tone = "warning", note = "";
      if (mode === "feverpain") {
        score = countChecked(["stFever","stPurulence","stRapid","stInflamed","stNoCoughCoryza"], [1,1,1,1,1]);
        if (score <= 1) { interpretation = "Вероятность пользы от антибиотика низкая."; tone = "good"; note = "Обычно антибиотик не предлагается; важны симптоматическое лечение и safety-netting."; }
        else if (score <= 3) { interpretation = "Промежуточный результат."; note = "Можно рассмотреть отказ от антибиотика или отсроченный рецепт с учётом клинической картины."; }
        else { interpretation = "Вероятность стрептококковой инфекции выше."; tone = "warning"; note = "Можно рассмотреть немедленный или отсроченный рецепт согласно локальным рекомендациям."; }
      } else {
        score = countChecked(["stExudate","stNodes","stTemp","stNoCough"], [1,1,1,1]);
        max = mode === "mcisaac" ? 5 : 4;
        if (mode === "mcisaac") {
          const age = parseNumber(document.getElementById("soreAge").value);
          if (!Number.isFinite(age) || age < 3 || age > 120) {
            setError("sorethroat", "Для McIsaac укажите возраст от 3 лет.");
            return false;
          }
          if (age <= 14) score += 1;
          else if (age >= 45) score -= 1;
        }
        if (mode === "centor") {
          if (score <= 2) { interpretation = "Вероятность пользы от антибиотика низкая."; tone = "good"; note = "Обычно антибиотик не предлагается."; }
          else { interpretation = "Вероятность стрептококковой инфекции выше."; tone = "warning"; note = "Рассмотрите тестирование или стратегию антибиотикотерапии по локальным рекомендациям."; }
        } else {
          if (score <= 0) { interpretation = "Низкая вероятность БГСА."; tone = "good"; }
          else if (score <= 2) { interpretation = "Низкая или промежуточная вероятность БГСА."; tone = "good"; }
          else { interpretation = "Повышенная вероятность БГСА."; tone = "warning"; }
          note = "McIsaac помогает определить необходимость тестирования; пороги тактики зависят от рекомендаций и доступности тестов.";
        }
      }
      document.getElementById("sorethroatUnit").textContent = "из " + max;
      setResult("sorethroat", String(score), interpretation, tone, note, (mode === "feverpain" ? "FeverPAIN" : mode === "centor" ? "Centor" : "McIsaac") + ": " + score + ". " + interpretation);
      return true;
    }

    function qtcTone(value, sex) {
      if (value >= 500) return ["Выраженное удлинение QTc (≥500 мс).", "danger"];
      const threshold = sex === "male" ? 450 : 460;
      if (value >= threshold) return ["QTc удлинён относительно распространённого полового порога.", "warning"];
      return ["QTc ниже распространённого порога удлинения.", "good"];
    }

    function calculateQtc() {
      setError("qtc", "");
      const qtRaw = parseNumber(document.getElementById("qtcQt").value);
      const qtUnit = document.getElementById("qtcQtUnit").value;
      const mode = document.querySelector('input[name="qtcInputMode"]:checked').value;
      const sex = document.querySelector('input[name="qtcSex"]:checked');
      const qt = qtUnit === "s" ? qtRaw * 1000 : qtRaw;
      let hr, rr;
      if (!Number.isFinite(qt) || qt < 200 || qt > 800 || !sex) {
        setError("qtc", "Укажите корректный QT и пол.");
        return false;
      }
      if (mode === "hr") {
        hr = parseNumber(document.getElementById("qtcHr").value);
        if (!Number.isFinite(hr) || hr < 20 || hr > 250) {
          setError("qtc", "Укажите корректную ЧСС.");
          return false;
        }
        rr = 60 / hr;
      } else {
        const rrRaw = parseNumber(document.getElementById("qtcRr").value);
        const rrUnit = document.getElementById("qtcRrUnit").value;
        const rrMs = rrUnit === "s" ? rrRaw * 1000 : rrRaw;
        if (!Number.isFinite(rrMs) || rrMs < 240 || rrMs > 3000) {
          setError("qtc", "Укажите корректный RR и выбранные единицы.");
          return false;
        }
        rr = rrMs / 1000;
        hr = 60 / rr;
      }
      const bazett = qt / Math.sqrt(rr);
      const fridericia = qt / Math.cbrt(rr);
      const framingham = qt + 154 * (1 - rr);
      const hodges = qt + 1.75 * (hr - 60);
      const values = [bazett, fridericia, framingham, hodges].map(Math.round);
      const metrics = document.querySelectorAll("#qtcMetrics strong");
      values.forEach((v, i) => metrics[i].textContent = v + " мс");
      const [interpretation, tone] = qtcTone(fridericia, sex.value);
      let note = "ЧСС: " + formatNumber(hr, 0) + "/мин. Категория по Fridericia до округления: " + formatNumber(fridericia, 2) + " мс. ";
      if (hr > 100) note += "При тахикардии Bazett часто завышает QTc.";
      else if (hr < 60) note += "При брадикардии Bazett часто занижает QTc.";
      else note += "Сопоставьте результат с морфологией T, лекарствами, электролитами и клиническим контекстом.";
      setResult("qtc", String(values[1]), interpretation, tone, note,
        "QTc: Bazett " + values[0] + " мс; Fridericia " + values[1] + " мс; Framingham " + values[2] + " мс; Hodges " + values[3] + " мс.");
      return true;
    }

    function calculateElectrolytes() {
      setError("electrolytes", "");
      const mode = document.querySelector('input[name="electroMode"]:checked').value;
      const label = document.getElementById("electrolytesLabel");
      const unitEl = document.getElementById("electrolytesUnit");
      let valueText, interpretation, tone = "", note, copy;

      if (mode === "calcium") {
        const caRaw = parseNumber(document.getElementById("elCa").value);
        const albRaw = parseNumber(document.getElementById("elCaAlb").value);
        const caUnit = document.getElementById("elCaUnit").value;
        const albUnit = document.getElementById("elCaAlbUnit").value;
        const albGl = albUnit === "gdl" ? albRaw * 10 : albRaw;
        const caMmol = caUnit === "mgdl" ? caRaw * 0.2495 : caRaw;
        if (!Number.isFinite(caMmol) || !Number.isFinite(albGl) || caMmol < 0.5 || caMmol > 5 || albGl < 5 || albGl > 70) { setError("electrolytes", "Проверьте общий кальций, альбумин и выбранные единицы."); return false; }
        let corrected;
        if (caUnit === "mmol") {
          corrected = caRaw + 0.02 * (40 - albGl);
          valueText = formatNumber(corrected, 2); unitEl.textContent = "ммоль/л";
        } else {
          const albGdl = albGl / 10;
          corrected = caRaw + 0.8 * (4 - albGdl);
          valueText = formatNumber(corrected, 2); unitEl.textContent = "мг/дл";
        }
        label.textContent = "Скорректированный кальций";
        interpretation = "Приближённая поправка по альбумину.";
        note = "Не используйте формулу вместо ионизированного кальция, когда требуется точная оценка.";
        copy = "Скорректированный кальций: " + valueText + " " + unitEl.textContent + ".";
      } else if (mode === "anion") {
        const na = parseNumber(document.getElementById("elAgNa").value);
        const cl = parseNumber(document.getElementById("elAgCl").value);
        const hco3 = parseNumber(document.getElementById("elAgHco3").value);
        const albText = document.getElementById("elAgAlb").value.trim();
        const albRaw = albText ? parseNumber(albText) : null;
        const albUnit = document.getElementById("elAgAlbUnit").value;
        const alb = albRaw === null ? null : (albUnit === "gdl" ? albRaw * 10 : albRaw);
        if (![na,cl,hco3].every(Number.isFinite) || na < 80 || na > 190 || cl < 40 || cl > 160 || hco3 < 2 || hco3 > 50) { setError("electrolytes", "Введите натрий, хлор и бикарбонат."); return false; }
        if (albText && (!Number.isFinite(alb) || alb < 5 || alb > 70)) { setError("electrolytes", "Проверьте альбумин и выбранные единицы."); return false; }
        const ag = na - cl - hco3;
        const corrected = alb === null ? ag : ag + 0.25 * (40 - alb);
        const delta = (corrected > 12 && hco3 < 24) ? (corrected - 12) / (24 - hco3) : NaN;
        valueText = formatNumber(corrected, 1); unitEl.textContent = "ммоль/л";
        label.textContent = alb === null ? "Анионная разница" : "АГ с поправкой на альбумин";
        interpretation = "Исходная АГ: " + formatNumber(ag,1) + (Number.isFinite(delta) ? "; delta ratio: " + formatNumber(delta,2) + "." : ".");
        note = "Референс анионной разницы зависит от анализатора и от включения калия; здесь используется Na − Cl − HCO₃.";
        copy = label.textContent + ": " + valueText + " ммоль/л. " + interpretation;
      } else if (mode === "sodium") {
        const na = parseNumber(document.getElementById("elNaMeasured").value);
        let glucose = parseNumber(document.getElementById("elNaGlucose").value);
        const unit = document.getElementById("elNaGluUnit").value;
        const factor = Number(document.querySelector('input[name="elNaFactor"]:checked').value);
        if (!Number.isFinite(na) || !Number.isFinite(glucose) || na < 80 || na > 190 || glucose < 0) { setError("electrolytes", "Введите натрий и глюкозу."); return false; }
        if (unit === "mmol") glucose *= 18;
        if (glucose > 5000) { setError("electrolytes", "Проверьте глюкозу и выбранные единицы."); return false; }
        const corrected = na + factor * Math.max(0, glucose - 100) / 100;
        valueText = formatNumber(corrected,1); unitEl.textContent = "ммоль/л";
        label.textContent = "Натрий с поправкой на гипергликемию";
        interpretation = "Поправка: " + factor.toFixed(1).replace(".",",") + " ммоль/л на каждые 100 мг/дл глюкозы выше 100.";
        note = "Расчёт не заменяет оценку эффективной осмоляльности и скорости коррекции натрия.";
        copy = "Скорректированный натрий: " + valueText + " ммоль/л.";
      } else if (mode === "osm") {
        const na = parseNumber(document.getElementById("elOsmNa").value);
        let glucose = parseNumber(document.getElementById("elOsmGlu").value);
        let urea = parseNumber(document.getElementById("elOsmUrea").value);
        const measuredText = document.getElementById("elOsmMeasured").value.trim();
        const measured = measuredText ? parseNumber(measuredText) : null;
        if (![na,glucose,urea].every(Number.isFinite) || na < 80 || na > 190 || glucose < 0 || urea < 0) { setError("electrolytes", "Введите натрий, глюкозу и мочевину/BUN."); return false; }
        const glucoseMmol = document.getElementById("elOsmGluUnit").value === "mgdl" ? glucose / 18 : glucose;
        const ureaMmol = document.getElementById("elOsmUreaUnit").value === "bun" ? urea / 2.8 : urea;
        if (glucoseMmol > 200 || ureaMmol > 200 || (measuredText && (!Number.isFinite(measured) || measured < 100 || measured > 500))) { setError("electrolytes", "Проверьте значения и выбранные единицы."); return false; }
        const calc = 2 * na + glucoseMmol + ureaMmol;
        valueText = formatNumber(calc,1); unitEl.textContent = "мОсм/кг";
        label.textContent = "Расчётная осмоляльность";
        if (measured !== null) {
          const gap = measured - calc;
          interpretation = "Осмолярный разрыв: " + formatNumber(gap,1) + " мОсм/кг.";
        } else interpretation = "Измеренная осмоляльность не указана — осмолярный разрыв не рассчитан.";
        note = "Формула: 2×Na + глюкоза (ммоль/л) + мочевина (ммоль/л).";
        copy = "Расчётная осмоляльность: " + valueText + " мОсм/кг. " + interpretation;
      } else {
        const weightRaw = parseNumber(document.getElementById("elWaterWeight").value);
        const weightUnit = document.getElementById("elWaterWeightUnit").value;
        const weight = weightUnit === "lb" ? weightRaw * 0.45359237 : weightRaw;
        const na = parseNumber(document.getElementById("elWaterNa").value);
        const coeff = Number(document.getElementById("elWaterCoeff").value);
        if (!Number.isFinite(weight) || !Number.isFinite(na) || weight <= 0 || weight > 400 || na <= 140 || na > 200) { setError("electrolytes", "Для расчёта дефицита укажите массу тела и натрий выше 140 ммоль/л."); return false; }
        const deficit = coeff * weight * (na / 140 - 1);
        valueText = formatNumber(deficit,1); unitEl.textContent = "л";
        label.textContent = "Расчётный дефицит свободной воды";
        interpretation = "Оценочный дефицит относительно целевого Na 140 ммоль/л.";
        tone = "warning";
        note = "Формула не учитывает текущие потери, поступление, диурез и безопасную скорость изменения натрия.";
        copy = "Дефицит свободной воды: " + valueText + " л.";
      }
      setResult("electrolytes", valueText, interpretation, tone, note, copy);
      return true;
    }


    function graceAgePoints(age) {
      if (age < 30) return 0;
      if (age < 40) return 8;
      if (age < 50) return 25;
      if (age < 60) return 41;
      if (age < 70) return 58;
      if (age < 80) return 75;
      if (age < 90) return 91;
      return 100;
    }

    function graceHrPoints(hr) {
      if (hr < 50) return 0;
      if (hr < 70) return 3;
      if (hr < 90) return 9;
      if (hr < 110) return 15;
      if (hr < 150) return 24;
      if (hr < 200) return 38;
      return 46;
    }

    function graceSbpPoints(sbp) {
      if (sbp >= 200) return 0;
      if (sbp >= 180) return 3;
      if (sbp >= 160) return 10;
      if (sbp >= 140) return 24;
      if (sbp >= 120) return 34;
      if (sbp >= 100) return 43;
      if (sbp >= 80) return 53;
      return 58;
    }

    function graceCrPoints(mgdl) {
      if (mgdl < 0.4) return 1;
      if (mgdl < 0.8) return 4;
      if (mgdl < 1.2) return 7;
      if (mgdl < 1.6) return 10;
      if (mgdl < 2.0) return 13;
      if (mgdl < 4.0) return 21;
      return 28;
    }

    function calculateGrace() {
      setError("grace", "");
      const age = parseNumber(document.getElementById("graceAge").value);
      const hr = parseNumber(document.getElementById("graceHr").value);
      const sbp = parseNumber(document.getElementById("graceSbp").value);
      const crRaw = parseNumber(document.getElementById("graceCr").value);
      const crUnit = document.getElementById("graceCrUnit").value;
      const killip = Number(document.getElementById("graceKillip").value);

      if (![age, hr, sbp, crRaw].every(Number.isFinite)) {
        setError("grace", "Заполните возраст, пульс, АД и креатинин.");
        return false;
      }
      if (age < 18 || age > 110 || hr < 20 || hr > 300 || sbp < 40 || sbp > 300 || crRaw <= 0) {
        setError("grace", "Проверьте диапазоны введённых значений.");
        return false;
      }

      const crMgdl = crUnit === "umol" ? crRaw / 88.4 : crRaw;
      if (crMgdl < 0.1 || crMgdl > 20) {
        setError("grace", "Проверьте креатинин и выбранные единицы.");
        return false;
      }
      const killipPoints = {1: 0, 2: 20, 3: 39, 4: 59}[killip];

      let score =
        graceAgePoints(age) +
        graceHrPoints(hr) +
        graceSbpPoints(sbp) +
        graceCrPoints(crMgdl) +
        killipPoints;

      if (document.getElementById("graceArrest").checked) score += 39;
      if (document.getElementById("graceSt").checked) score += 28;
      if (document.getElementById("graceBio").checked) score += 14;

      let interpretation, tone;
      if (score > 140) {
        interpretation = "Высокий риск; порог >140 связан с приоритетом ранней инвазивной стратегии при NSTE-ACS.";
        tone = "danger";
      } else if (score >= 109) {
        interpretation = "Промежуточный риск.";
        tone = "warning";
      } else {
        interpretation = "Низкий риск по балльной категории.";
        tone = "good";
      }

      setResult("grace", String(score), interpretation, tone,
        "Используйте вместе с клинической стабильностью, ЭКГ, тропонином и действующими протоколами ОКС.",
        "GRACE ACS: " + score + " баллов. " + interpretation);
      return true;
    }

    const CAD_PTP_TABLE = {
      male: {
        typical: [3, 22, 32, 44, 52],
        atypical: [4, 10, 17, 26, 34],
        nonanginal: [1, 3, 11, 22, 24],
        dyspnea: [0, 12, 20, 27, 32]
      },
      female: {
        typical: [5, 10, 13, 16, 27],
        atypical: [3, 6, 6, 11, 19],
        nonanginal: [1, 2, 3, 6, 10],
        dyspnea: [3, 3, 9, 14, 12]
      }
    };

    function calculateCadptp() {
      setError("cadptp", "");
      const age = parseNumber(document.getElementById("cadAge").value);
      const sexInput = document.querySelector('input[name="cadSex"]:checked');
      const symptoms = document.getElementById("cadSymptoms").value;

      if (!Number.isFinite(age) || !sexInput) {
        setError("cadptp", "Укажите возраст и пол.");
        return false;
      }
      if (age < 30 || age > 90) {
        setError("cadptp", "Базовая таблица применяется в возрасте от 30 лет; для старших возрастов используется категория 70+.");
        return false;
      }

      const ageIndex = age < 40 ? 0 : age < 50 ? 1 : age < 60 ? 2 : age < 70 ? 3 : 4;
      const value = CAD_PTP_TABLE[sexInput.value][symptoms][ageIndex];

      let interpretation, tone;
      if (value <= 5) {
        interpretation = "Очень низкая базовая вероятность.";
        tone = "good";
      } else if (value <= 15) {
        interpretation = "Низкая базовая вероятность; решение о тестировании зависит от модификаторов.";
        tone = "good";
      } else if (value <= 50) {
        interpretation = "Промежуточная базовая вероятность.";
        tone = "warning";
      } else {
        interpretation = "Высокая базовая вероятность.";
        tone = "danger";
      }

      setResult("cadptp", String(value), interpretation, tone,
        "ESC 2024 рекомендует уточнять вероятность с помощью факторов риска и других модификаторов.",
        "Базовая PTP обструктивной ИБС: " + value + "%. " + interpretation);
      return true;
    }

    function clamp(value, minimum, maximum) {
      return Math.min(maximum, Math.max(minimum, value));
    }

    function calculatePrecisedapt() {
      setError("precisedapt", "");
      const age = parseNumber(document.getElementById("pdAge").value);
      const crcl = parseNumber(document.getElementById("pdCrcl").value);
      const hbRaw = parseNumber(document.getElementById("pdHb").value);
      const hbUnit = document.getElementById("pdHbUnit").value;
      const wbc = parseNumber(document.getElementById("pdWbc").value);
      const priorBleed = Number(document.querySelector('input[name="pdBleed"]:checked').value);

      if (![age, crcl, hbRaw, wbc].every(Number.isFinite)) {
        setError("precisedapt", "Заполните возраст, клиренс креатинина, гемоглобин и лейкоциты.");
        return false;
      }

      const hb = hbUnit === "gl" ? hbRaw / 10 : hbRaw;
      if (age < 18 || age > 100 || crcl < 0 || crcl > 200 || hb < 5 || hb > 20 || wbc < 0.5 || wbc > 50) {
        setError("precisedapt", "Проверьте введённые значения и единицы.");
        return false;
      }

      const linearPredictor =
        clamp(age, 50, 90) * 0.02595618 -
        clamp(hb, 10, 12) * 0.40551264 +
        clamp(wbc, 5, 20) * 0.05697497 -
        clamp(crcl, 0, 100) * 0.0140439 +
        priorBleed * 1.41955653 +
        4.68785783;
      const score = clamp(Math.round(100 * linearPredictor / 5.52784356), 0, 100);

      let interpretation, tone;
      if (score >= 25) {
        interpretation = "Высокий риск кровотечения.";
        tone = "danger";
      } else if (score >= 18) {
        interpretation = "Умеренный риск кровотечения.";
        tone = "warning";
      } else if (score >= 11) {
        interpretation = "Низкий риск кровотечения.";
        tone = "good";
      } else {
        interpretation = "Очень низкий риск кровотечения.";
        tone = "good";
      }

      setResult("precisedapt", String(score), interpretation, tone,
        "Порог ≥25 соответствует высокому риску кровотечения и требует клинической оценки длительности ДАТТ.",
        "PRECISE-DAPT: " + score + " баллов. " + interpretation);
      return true;
    }

    function calculateFrax() {
      setError("frax", "");
      const age = parseNumber(document.getElementById("fraxAge").value);
      const sex = document.querySelector('input[name="fraxSex"]:checked');
      const weightRaw = parseNumber(document.getElementById("fraxWeight").value);
      const heightRaw = parseNumber(document.getElementById("fraxHeight").value);
      const weightUnit = document.getElementById("fraxWeightUnit").value;
      const heightUnit = document.getElementById("fraxHeightUnit").value;
      const tscoreRaw = document.getElementById("fraxTscore").value.trim();
      const tscore = tscoreRaw ? parseNumber(tscoreRaw) : null;

      if (![age, weightRaw, heightRaw].every(Number.isFinite) || !sex) {
        setError("frax", "Укажите возраст, пол, массу тела и рост.");
        return false;
      }
      if (tscoreRaw && !Number.isFinite(tscore)) {
        setError("frax", "Проверьте T-критерий шейки бедра.");
        return false;
      }
      if (age < 40 || age > 90) {
        setError("frax", "Официальная модель принимает возраст 40–90 лет.");
        return false;
      }

      const weightKg = weightUnit === "lb" ? weightRaw * 0.45359237 : weightRaw;
      const heightM = heightUnit === "in" ? heightRaw * 0.0254 : heightRaw / 100;
      if (weightKg < 20 || weightKg > 300 || heightM < 1.0 || heightM > 2.4 || (tscore !== null && (tscore < -8 || tscore > 5))) {
        setError("frax", "Проверьте антропометрию и T-критерий.");
        return false;
      }

      const bmi = weightKg / (heightM * heightM);
      const factors = [
        ["предыдущий перелом", "fraxPrev"],
        ["перелом бедра у родителя", "fraxParent"],
        ["курение", "fraxSmoke"],
        ["глюкокортикоиды", "fraxGc"],
        ["ревматоидный артрит", "fraxRa"],
        ["вторичный остеопороз", "fraxSecondary"],
        ["алкоголь ≥3 единиц/сут", "fraxAlcohol"]
      ].filter(([, id]) => document.getElementById(id).checked).map(([label]) => label);

      const summary =
        "FRAX: возраст " + age + "; пол " + (sex.value === "female" ? "женский" : "мужской") +
        "; масса " + formatNumber(weightKg, 1) + " кг; рост " + formatNumber(heightM * 100, 0) +
        " см; ИМТ " + formatNumber(bmi, 1) +
        (factors.length ? "; факторы: " + factors.join(", ") : "; дополнительные факторы не отмечены") +
        (tscore !== null ? "; T-критерий шейки бедра " + formatNumber(tscore, 1) : "; BMD/T-критерий не указан") + ".";

      setResult("frax", formatNumber(bmi, 1),
        "Данные готовы. Откройте официальный FRAX и выберите страну пациента.",
        "",
        "Локально рассчитан только ИМТ; 10-летняя вероятность перелома рассчитывается официальной country-specific моделью.",
        summary);
      return true;
    }


    function egfrCategory(value) {
      if (value >= 90) return { category: "G1", description: "нормальная или высокая СКФ", tone: "good" };
      if (value >= 60) return { category: "G2", description: "незначительно сниженная СКФ", tone: "good" };
      if (value >= 45) return { category: "G3a", description: "умеренно сниженная СКФ", tone: "warning" };
      if (value >= 30) return { category: "G3b", description: "умеренно–значительно сниженная СКФ", tone: "warning" };
      if (value >= 15) return { category: "G4", description: "значительно сниженная СКФ", tone: "danger" };
      return { category: "G5", description: "категория почечной недостаточности", tone: "danger" };
    }

    function calculateEgfrcys() {
      setError("egfrcys", "");

      const age = parseNumber(document.getElementById("egfrcysAge").value);
      const cystatin = parseNumber(document.getElementById("egfrcysCystatin").value);
      const sexInput = document.querySelector('input[name="egfrcysSex"]:checked');
      const creatinineText = document.getElementById("egfrcysCreatinine").value.trim();
      const creatinineRaw = creatinineText ? parseNumber(creatinineText) : null;
      const creatinineUnit = document.getElementById("egfrcysCreatinineUnit").value;

      if (!Number.isFinite(age) || !Number.isFinite(cystatin) || !sexInput) {
        setError("egfrcys", "Укажите возраст, пол и цистатин C.");
        return false;
      }

      if (age < 18 || age > 120) {
        setError("egfrcys", "Формулы предназначены для взрослых 18 лет и старше.");
        return false;
      }

      if (cystatin < 0.2 || cystatin > 10) {
        setError("egfrcys", "Проверьте значение цистатина C.");
        return false;
      }

      if (creatinineText && (!Number.isFinite(creatinineRaw) || creatinineRaw <= 0)) {
        setError("egfrcys", "Проверьте значение креатинина.");
        return false;
      }

      const female = sexInput.value === "female";
      const cysRatio = cystatin / 0.8;

      let egfrCys =
        133 *
        Math.pow(Math.min(cysRatio, 1), -0.499) *
        Math.pow(Math.max(cysRatio, 1), -1.328) *
        Math.pow(0.996, age);

      if (female) egfrCys *= 0.932;

      let egfrCombined = null;

      if (creatinineText) {
        const scr = creatinineUnit === "umol" ? creatinineRaw / 88.4 : creatinineRaw;

        if (scr < 0.1 || scr > 20) {
          setError("egfrcys", "Проверьте креатинин и выбранные единицы.");
          return false;
        }

        const kappa = female ? 0.7 : 0.9;
        const alpha = female ? -0.219 : -0.144;
        const crRatio = scr / kappa;

        egfrCombined =
          135 *
          Math.pow(Math.min(crRatio, 1), alpha) *
          Math.pow(Math.max(crRatio, 1), -0.544) *
          Math.pow(Math.min(cysRatio, 1), -0.323) *
          Math.pow(Math.max(cysRatio, 1), -0.778) *
          Math.pow(0.9961, age);

        if (female) egfrCombined *= 0.963;
      }

      const cysRounded = Math.round(egfrCys);
      const combinedRounded = egfrCombined === null ? null : Math.round(egfrCombined);
      const primaryRaw = egfrCombined ?? egfrCys;
      const primary = Math.round(primaryRaw);
      const primaryName = combinedRounded === null
        ? "CKD-EPI cystatin C 2012"
        : "CKD-EPI creatinine–cystatin C 2021";

      const classification = egfrCategory(primaryRaw);

      document.getElementById("egfrcysOnlyMetric").textContent =
        cysRounded + " мл/мин/1,73 м²";
      document.getElementById("egfrcysCombinedMetric").textContent =
        combinedRounded === null
          ? "нужен креатинин"
          : combinedRounded + " мл/мин/1,73 м²";
      document.getElementById("egfrcysResultLabel").textContent = primaryName;

      const interpretation =
        classification.category + " — " + classification.description + ".";

      let note =
        "Основной результат: " + primaryName + ". " +
        "Категории G1–G2 сами по себе не подтверждают ХБП без других признаков поражения почек.";

      if (combinedRounded !== null) {
        const difference = Math.abs(combinedRounded - cysRounded);
        const denominator = Math.max(combinedRounded, cysRounded);
        const percentDifference = denominator > 0 ? difference / denominator * 100 : 0;

        if (percentDifference >= 20) {
          note += " Между оценками есть расхождение ≥20%; оцените возможные не-GFR факторы для креатинина и цистатина C.";
        }
      }

      const copyText =
        "СКФ с цистатином C: " +
        "eGFRcys 2012 — " + cysRounded + " мл/мин/1,73 м²" +
        (combinedRounded === null
          ? ""
          : "; eGFRcr-cys 2021 — " + combinedRounded + " мл/мин/1,73 м²") +
        ". " + interpretation;

      setResult(
        "egfrcys",
        String(primary),
        interpretation,
        classification.tone,
        note,
        copyText
      );

      return true;
    }

    function resetAuxiliaryMetrics(key) {
      if (key === "qtc") {
        document.querySelectorAll("#qtcMetrics strong").forEach((element) => {
          element.textContent = "—";
        });
      }
      if (key === "egfrcys") {
        document.getElementById("egfrcysResultLabel").textContent = "Расчётная СКФ";
        document.getElementById("egfrcysOnlyMetric").textContent = "—";
        document.getElementById("egfrcysCombinedMetric").textContent = "нужен креатинин";
      }
    }


    const calculators = {
      score2diabetes: () => calculateExtendedScore2("score2diabetes"),
      cadptp: calculateCadptp,
      afstroke: calculateAfstroke,
      grace: calculateGrace,
      precisedapt: calculatePrecisedapt,
      qtc: calculateQtc,
      vte: calculateVte,
      pneumonia: calculatePneumonia,
      sorethroat: calculateSorethroat,
      egfrcys: calculateEgfrcys,
      electrolytes: calculateElectrolytes,
      mentzer: calculateMentzer,
      tsat: calculateTsat,
      maf5: calculateMaf5,
      liverpro: calculateLiverpro,
      adapt: calculateAdapt,
      stopbang: calculateStopbang,
      epworth: calculateEpworth,
      frax: calculateFrax,
      mmse: calculateMmse,
    };

// Page integration
const selectedId = new URLSearchParams(window.location.search).get("tool");
const selectedTool = window.MEDICAL_CALCULATORS.find(tool => tool.id === selectedId && tool.migrated);
document.querySelectorAll(".calculator").forEach(section => {section.hidden = !selectedTool || section.id !== selectedId;});
document.getElementById("tool-not-found").hidden = !!selectedTool;
if (selectedTool) {
 document.title = selectedTool.title + " — Медицинские калькуляторы";
 window.PatientSharing.init({ toolId: selectedId, title: selectedTool.title, getResult: () => state.results[selectedId] ? state.results[selectedId] + "\n" + document.getElementById(selectedId + "Note").textContent : "" });
} else {
 document.querySelectorAll(".sharing-toolbar button").forEach(button => { button.hidden = true; });
}
function preferredScrollBehavior() { return "auto"; }
    ["score2diabetes"].forEach(key => {
    const score2CountrySelect = document.getElementById(key + "Country");
    Object.entries(SCORE2_COUNTRIES).forEach(([code, [name]]) => {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = name;
      score2CountrySelect.appendChild(option);
    });
    const manualCountryOption = document.createElement("option");
    manualCountryOption.value = "manual";
    manualCountryOption.textContent = "Выбрать регион вручную";
    score2CountrySelect.appendChild(manualCountryOption);

    function updateScore2Country() {
      const country = score2CountrySelect.value;
      const manual = country === "manual";
      document.getElementById(key + "ManualRegion").hidden = !manual;
      const region = SCORE2_COUNTRIES[country]?.[1];
      document.getElementById(key + "RegionHint").textContent = region
        ? "Региональный риск: " + SCORE2_REGION_NAMES[region] + " (ESC 2021)."
        : "Регион риска определяется по стране.";
    }
    score2CountrySelect.addEventListener("change", updateScore2Country);
    document.getElementById(key + "Form").addEventListener("reset", () => requestAnimationFrame(updateScore2Country));
    updateScore2Country();
    });

    function announce(message) {
      const status = document.getElementById("appStatus");
      status.textContent = message;
    }

    function invalidateResult(key) {
      if (state.results[key] === null) return;
      clearResult(key, "Данные изменены — рассчитайте заново.");
      resetAuxiliaryMetrics(key);
    }

    Object.entries(calculators).forEach(([key, fn]) => {
      const form = document.getElementById(key + "Form");
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const success = fn();
        const target = document.getElementById(key + (success ? "Result" : "Error"));
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        target.scrollIntoView({ behavior: preferredScrollBehavior(), block: "nearest" });
      });
      form.addEventListener("input", () => invalidateResult(key));
      form.addEventListener("change", () => invalidateResult(key));
    });

    document.querySelectorAll(".reset-card").forEach((button) => {
      button.addEventListener("click", () => {
        const formId = button.dataset.form;
        const form = document.getElementById(formId);
        const key = formId.replace("Form", "");
        form.reset();
        resetAuxiliaryMetrics(key);

        if (key === "tsat") {
          document.getElementById("tsatTibcPanel").hidden = false;
          document.getElementById("tsatTransferrinPanel").hidden = true;
        }
        if (key === "vte") updateVteMode();
        if (key === "pneumonia") updatePneumoniaMode();
        if (key === "sorethroat") updateSoreMode();
        if (key === "qtc") {
          updateQtcMode();
          document.querySelectorAll("#qtcMetrics strong").forEach(el => el.textContent = "—");
        }
        if (key === "electrolytes") {
          updateElectroMode();
          document.getElementById("electrolytesLabel").textContent = "Скорректированный кальций";
          document.getElementById("electrolytesUnit").textContent = "ммоль/л";
        }

        const prompts = {
          bmi: "Введите массу тела и рост.",
          egfr: "Введите возраст, пол и креатинин.",
          mentzer: "Введите MCV и число эритроцитов.",
          tsat: "Введите показатели обмена железа.",
          score2: "Введите данные пациента.",
          score2op: "Введите данные пациента.",
          score2diabetes: "Введите данные пациента.",
          prevent: "Введите данные пациента.",
          phq9: "Ответьте на 9 вопросов.",
          gad7: "Ответьте на 7 вопросов.",
          mmse: "Отметьте правильно выполненные задания.",
          fib4: "Введите возраст, АСТ, АЛТ и тромбоциты.",
          maf5: "Введите антропометрию и лабораторные данные.",
          liverpro: "Введите результат из сертифицированной системы.",
          adapt: "Введите возраст, PRO-C3 и тромбоциты.",
          stopbang: "Отметьте критерии.",
          epworth: "Ответь на все восемь вопросов.",
          afstroke: "Введите возраст, пол и отметьте факторы риска.",
          vte: "Выберите инструмент и заполните данные.",
          pneumonia: "Введите показатели пациента.",
          sorethroat: "Выберите шкалу и отметьте критерии.",
          qtc: "Введите QT, ЧСС или RR и пол.",
          electrolytes: "Выберите расчёт и заполните данные.",
          grace: "Введите данные пациента.",
          hasbled: "Введите возраст и отметьте факторы.",
          cadptp: "Введите возраст, пол и тип симптомов.",
          dlcn: "Заполните критерии.",
          precisedapt: "Введите пять параметров.",
          frax: "Заполните антропометрию и факторы риска.",
          egfrcys: "Введите возраст, пол и цистатин C."
        };

        clearResult(key, prompts[key]);
      });
    });

    document.querySelectorAll('input[name="tsatMode"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        const mode = document.querySelector('input[name="tsatMode"]:checked').value;
        document.getElementById("tsatTibcPanel").hidden = mode !== "tibc";
        document.getElementById("tsatTransferrinPanel").hidden = mode !== "transferrin";
        clearResult("tsat", "Введите показатели обмена железа.");
      });
    });


    function updateVteMode() {
      const mode = document.querySelector('input[name="vteMode"]:checked').value;
      setModePanels('vteMode', {pe:"vtePePanel", perc:"vtePercPanel", dvt:"vteDvtPanel", ddimer:"vteDdimerPanel"}, mode);
      clearResult("vte", "Выберите инструмент и заполните данные.");
      document.getElementById("vteResultUnit").textContent = mode === "ddimer" ? "порог" : "баллов";
    }
    document.querySelectorAll('input[name="vteMode"]').forEach(el => el.addEventListener("change", updateVteMode));

    function updatePneumoniaMode() {
      const mode = document.querySelector('input[name="pneumoniaMode"]:checked').value;
      document.getElementById("pneuUreaPanel").hidden = mode !== "curb";
      clearResult("pneumonia", "Введите показатели пациента.");
      document.getElementById("pneumoniaUnit").textContent = mode === "curb" ? "из 5" : "из 4";
    }
    document.querySelectorAll('input[name="pneumoniaMode"]').forEach(el => el.addEventListener("change", updatePneumoniaMode));

    function updateSoreMode() {
      const mode = document.querySelector('input[name="soreMode"]:checked').value;
      document.getElementById("soreFeverPanel").hidden = mode !== "feverpain";
      document.getElementById("soreCentorPanel").hidden = mode === "feverpain";
      document.getElementById("soreAgePanel").hidden = mode !== "mcisaac";
      clearResult("sorethroat", "Выберите шкалу и отметьте критерии.");
      document.getElementById("sorethroatUnit").textContent = mode === "centor" ? "из 4" : "из 5";
    }
    document.querySelectorAll('input[name="soreMode"]').forEach(el => el.addEventListener("change", updateSoreMode));

    function updateQtcMode() {
      const mode = document.querySelector('input[name="qtcInputMode"]:checked').value;
      document.getElementById("qtcHrPanel").hidden = mode !== "hr";
      document.getElementById("qtcRrPanel").hidden = mode !== "rr";
      clearResult("qtc", "Введите QT, ЧСС или RR и пол.");
      resetAuxiliaryMetrics("qtc");
    }
    document.querySelectorAll('input[name="qtcInputMode"]').forEach(el => el.addEventListener("change", updateQtcMode));

    function updateElectroMode() {
      const mode = document.querySelector('input[name="electroMode"]:checked').value;
      setModePanels('electroMode', {
        calcium:"electroCalciumPanel", anion:"electroAnionPanel", sodium:"electroSodiumPanel",
        osm:"electroOsmPanel", water:"electroWaterPanel"
      }, mode);
      clearResult("electrolytes", "Выберите расчёт и заполните данные.");
      const labels = {
        calcium:["Скорректированный кальций","ммоль/л"],
        anion:["Анионная разница","ммоль/л"],
        sodium:["Натрий с поправкой","ммоль/л"],
        osm:["Расчётная осмоляльность","мОсм/кг"],
        water:["Дефицит свободной воды","л"]
      };
      document.getElementById("electrolytesLabel").textContent = labels[mode][0];
      document.getElementById("electrolytesUnit").textContent = labels[mode][1];
    }
    document.querySelectorAll('input[name="electroMode"]').forEach(el => el.addEventListener("change", updateElectroMode));
    const copyTimers = new WeakMap();

    async function copyTextToClipboard(text, button) {
        let copied = false;
        try {
          await navigator.clipboard.writeText(text);
          copied = true;
        } catch {
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          try { copied = document.execCommand("copy"); }
          catch { copied = false; }
          finally { textarea.remove(); }
          button.focus({ preventScroll: true });
        }

        const original = button.dataset.originalText || button.textContent;
        button.dataset.originalText = original;
        button.textContent = button.classList.contains("permalink-button")
          ? (copied ? "✓" : "×") : (copied ? "Скопировано" : "Не удалось");
        announce(copied ? "Скопировано в буфер обмена." : "Копирование недоступно. Выделите текст результата вручную.");
        clearTimeout(copyTimers.get(button));
        copyTimers.set(button, setTimeout(() => {
          button.textContent = original;
          copyTimers.delete(button);
        }, 1300));
    }

    document.querySelectorAll(".copy-button").forEach((button) => {
      button.addEventListener("click", () => {
        const text = state.results[button.dataset.copy];
        if (text) copyTextToClipboard(text, button);
      });
    });

    function bindCholesterolUnit(unitId, inputId, hdl = false) {
      const unit = document.getElementById(unitId);
      const input = document.getElementById(inputId);
      let previousUnit = unit.value;
      const placeholder = () => {
        input.placeholder = unit.value === "mgdl" ? (hdl ? "Например, 50" : "Например, 212") : (hdl ? "Например, 1,3" : "Например, 5,5");
      };
      unit.addEventListener("change", () => {
        const value = parseNumber(input.value);
        if (unit.value !== previousUnit && input.value.trim()) {
          if (Number.isFinite(value)) {
            const mmol = cholesterolToMmol(value, previousUnit);
            const converted = unit.value === "mmol" ? mmol : mmol / 0.02586;
            input.value = String(Number(converted.toPrecision(8))).replace(".", ",");
            announce("Значение холестерина переведено в " + (unit.value === "mmol" ? "ммоль/л." : "мг/дл."));
          } else {
            input.value = "";
            announce("Введите значение заново в выбранных единицах.");
          }
        }
        previousUnit = unit.value;
        placeholder();
      });
      unit.closest("form").addEventListener("reset", () => requestAnimationFrame(() => {
        previousUnit = unit.value;
        placeholder();
      }));
      placeholder();
    }

    ["score2diabetes"].forEach((key) => {
      bindCholesterolUnit(key + "TcUnit", key + "Tc");
      bindCholesterolUnit(key + "HdlUnit", key + "Hdl", true);
      const note = document.createElement("small");
      note.className = "help unit-conversion-note";
      note.textContent = "При смене единиц холестерина введённое значение пересчитывается автоматически.";
      document.getElementById(key + "Form").querySelector(".field-grid").appendChild(note);
    });

    const hbaUnit = document.getElementById("score2diabetesHba1cUnit");
    const hbaInput = document.getElementById("score2diabetesHba1c");
    let previousHbaUnit = hbaUnit.value;
    hbaUnit.addEventListener("change", () => {
      if (hbaUnit.value !== previousHbaUnit && hbaInput.value.trim()) {
        const n = parseNumber(hbaInput.value);
        const ifcc = hba1cToIfcc(n, previousHbaUnit);
        hbaInput.value = Number.isFinite(n) ? String(Number((hbaUnit.value === "percent" ? ifcc * 0.09148 + 2.152 : ifcc).toPrecision(8))).replace(".", ",") : "";
        announce("Значение HbA1c переведено в выбранные единицы.");
      }
      previousHbaUnit = hbaUnit.value;
      hbaInput.placeholder = hbaUnit.value === "percent" ? "Например, 7" : "Например, 53";
    });
    hbaUnit.closest("form").addEventListener("reset", () => requestAnimationFrame(() => {
      previousHbaUnit = hbaUnit.value;
      hbaInput.placeholder = "Например, 7";
    }));
