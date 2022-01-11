import CONFIG from "../data/config";

export function openOnboarding() {
  location.hash = "/onboarding/";
}

export async function triggerOnboardingIfFirstTime() {
  const [hasSeenOnboarding, devAlwaysShowOnboarding] = await Promise.all([
    CONFIG.getHasSeenOnboarding(),
    CONFIG.getDevAlwaysShowOnboarding(),
  ]);

  if (!hasSeenOnboarding || devAlwaysShowOnboarding) {
    openOnboarding();
  }
}
