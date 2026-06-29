const genericPlanningPattern =
  /그냥|재미(?:있|난)|보상(?:을)?\s*받|점수(?:를)?\s*올|카드\s*UI|공통\s*(?:게임|스킨|화면)|같은\s*(?:느낌|디자인)|generic\s*(?:card|game|skin|arcade)|same\s*skin/i;
const visualSamenessPattern = /카드\s*목록|일반\s*카드|공통\s*패널|대시보드\s*카드|generic|same\s*skin/i;
const chanceModePattern = /복권|lottery|chance|gacha|random|확률|대출|loan|debt/i;
const chanceSafetyPatterns = [/실제\s*돈|actual[-\s]*money|현금화|결제/, /확률|odds|기대값|EV/i, /손실\s*추격|loss[-\s]*chasing|도박/i, /대출|loan|debt|재기|복구/i];

function normalizedTextLength(value) {
  return (value ?? "").replace(/\s+/g, " ").trim().length;
}

function normalizeValue(value) {
  return (value ?? "").replace(/\s+/g, " ").trim().toLowerCase();
}

function requireText(failures, label, path, value, minLength = 18) {
  if (normalizedTextLength(value) < minLength) {
    failures.push(`${label} ${path} should be a useful planning prompt, not an empty label`);
  }
  if (genericPlanningPattern.test(value ?? "")) {
    failures.push(`${label} ${path} is too generic; leave a game-specific question or research angle`);
  }
}

function requireArray(failures, label, path, value, minLength, minTextLength = 10) {
  if (!Array.isArray(value) || value.length < minLength) {
    failures.push(`${label} ${path} should include at least ${minLength} entries`);
    return [];
  }
  value.forEach((item, index) => requireText(failures, label, `${path}[${index}]`, item, minTextLength));
  return value;
}

export function validatePlayPlanningBriefs(playEntries) {
  const failures = [];
  const visualMetaphors = [];

  for (const entry of playEntries) {
    const label = entry.slug ?? entry.file;
    const brief = entry.planningBrief;
    if (!brief) {
      failures.push(`${label} must declare planningBrief so Play work starts from game-specific planning, external research, and visual direction`);
      continue;
    }

    requireText(failures, label, "planningBrief.gameMode", brief.gameMode, 8);
    requireText(failures, label, "planningBrief.planningIntent", brief.planningIntent, 28);

    const research = brief.researchPlan;
    if (!research) {
      failures.push(`${label} planningBrief.researchPlan is required before implementing or redesigning a game`);
    } else {
      requireArray(failures, label, "planningBrief.researchPlan.webSearchSeeds", research.webSearchSeeds, 3);
      requireArray(failures, label, "planningBrief.researchPlan.referenceTypes", research.referenceTypes, 3);
      requireArray(failures, label, "planningBrief.researchPlan.dataOrSimulationNeeds", research.dataOrSimulationNeeds, 2);
    }

    requireArray(failures, label, "planningBrief.systemQuestions", brief.systemQuestions, 5);
    requireArray(failures, label, "planningBrief.visualQuestions", brief.visualQuestions, 4);
    requireArray(failures, label, "planningBrief.riskAndSafetyNotes", brief.riskAndSafetyNotes, 2);

    const mechanic = brief.mechanicProfile;
    if (!mechanic) {
      failures.push(`${label} planningBrief.mechanicProfile is required`);
    } else {
      requireText(failures, label, "planningBrief.mechanicProfile.primaryResource", mechanic.primaryResource, 12);
      requireText(failures, label, "planningBrief.mechanicProfile.progressionQuestion", mechanic.progressionQuestion, 20);
      requireText(failures, label, "planningBrief.mechanicProfile.failureQuestion", mechanic.failureQuestion, 20);
      requireText(failures, label, "planningBrief.mechanicProfile.recoveryQuestion", mechanic.recoveryQuestion, 20);
    }

    const visual = brief.initialVisualDirection;
    if (!visual) {
      failures.push(`${label} planningBrief.initialVisualDirection is required so different game moods do not reuse one visual skin`);
    } else {
      requireText(failures, label, "planningBrief.initialVisualDirection.metaphor", visual.metaphor, 10);
      requireText(failures, label, "planningBrief.initialVisualDirection.primarySurface", visual.primarySurface, 10);
      requireText(failures, label, "planningBrief.initialVisualDirection.roughnessTarget", visual.roughnessTarget, 10);
      requireText(failures, label, "planningBrief.initialVisualDirection.differenceFromGenericPlay", visual.differenceFromGenericPlay, 20);
      if (visualSamenessPattern.test([visual.metaphor, visual.primarySurface, visual.differenceFromGenericPlay].filter(Boolean).join("\n"))) {
        failures.push(`${label} visual direction should not point back to generic cards, common panels, or one shared game skin`);
      }
      requireArray(failures, label, "planningBrief.initialVisualDirection.mustAvoid", visual.mustAvoid, 2, 5);
      visualMetaphors.push(normalizeValue(visual.metaphor));
    }

    if (chanceModePattern.test([brief.gameMode, brief.planningIntent, entry.title, entry.description].filter(Boolean).join("\n"))) {
      const safetyText = (brief.riskAndSafetyNotes ?? []).join("\n");
      for (const pattern of chanceSafetyPatterns) {
        if (!pattern.test(safetyText)) {
          failures.push(`${label} chance/lottery-style planning needs safety coverage for ${pattern}`);
        }
      }
    }
  }

  const distinctMetaphors = new Set(visualMetaphors.filter(Boolean));
  const minimumDistinctMetaphors = Math.min(8, Math.max(3, Math.ceil(playEntries.length * 0.3)));
  if (distinctMetaphors.size < minimumDistinctMetaphors) {
    failures.push(`Play planning should keep visual identities varied; found ${distinctMetaphors.size} distinct metaphors, expected at least ${minimumDistinctMetaphors}`);
  }

  return failures;
}
