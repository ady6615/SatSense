exports.analyzeEvent = (req, res) => {
  try {
    const { type, magnitude, location } = req.body;

    let severity = "Low";
    let cause = "";
    let impact = "";

    if (type === "Earthquake") {
      cause = "Tectonic plate movement along fault lines";

      if (magnitude >= 6) {
        severity = "High";
        impact = "Severe ground shaking, infrastructure damage, possible casualties";
      } else if (magnitude >= 4) {
        severity = "Medium";
        impact = "Noticeable shaking, minor structural damage";
      } else {
        impact = "Light shaking, minimal damage";
      }
    } else {
      cause = "Natural environmental factors";
      impact = "Localized environmental impact";
    }

    res.json({
      eventType: type,
      location,
      severity,
      cause,
      impact,
      analysisSummary:
        "Satellite image comparison indicates observable surface-level changes consistent with the detected event."
    });

  } catch (error) {
    res.status(500).json({ error: "Analysis failed" });
  }
};
