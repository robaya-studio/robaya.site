// Generates games/hwatu/privacy.html and terms.html from the English strings in
// games/hwatu/locales/translations.js, so the static fallback text matches the translations.
// Run after editing the agreements in that file:   node tools/build-hwatu-legal.js
// The page structure (which keys, in which order) is the spec below; the script fails if an
// agreement key in the translations is not placed on either page.
const fs = require('fs');
const path = require('path');

const site = process.argv[2] || path.join(__dirname, '..');
global.window = {};
require(path.join(site, 'games/hwatu/locales/translations.js'));
const en = window.hwatuTranslations.en;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const t = (key) => {
  if (!en[key]) {
    throw new Error(`missing key ${key}`);
  }
  return esc(en[key]);
};

// Spec: 'h2:key', 'p:key', ['ul', key...], raw html strings starting with '<'
function render(spec) {
  const out = [];
  for (const item of spec) {
    if (Array.isArray(item)) {
      out.push('      <ul>');
      for (const key of item.slice(1)) {
        out.push(key.startsWith('<') ? `        ${key}` : `        <li data-i18n="${key}">${t(key)}</li>`);
      }
      out.push('      </ul>');
    } else if (item.startsWith('<')) {
      out.push(`      ${item}`);
    } else {
      const [tag, key] = item.split(':');
      if (tag === 'h2') {
        out.push('');
      }
      out.push(`      <${tag} data-i18n="${key}">${t(key)}</${tag}>`);
    }
  }
  return out.join('\n');
}

function page({ titleKey, h1Key, metaKey, spec, canonical }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title data-i18n="${titleKey}">${t(titleKey)}</title>
  <meta name="theme-color" content="#f7f4ee" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#0f0e0c" media="(prefers-color-scheme: dark)">
  <link rel="canonical" href="https://robaya.studio/games/hwatu/${canonical}">
  <link rel="icon" href="AppIcon.png" type="image/png">
  <link rel="apple-touch-icon" href="apple-touch-icon.png">
  <link rel="stylesheet" href="../../css/style.css">
  <script src="../../js/translations.js"></script>
  <script src="locales/translations.js"></script>
  <script src="../../js/theme.js"></script>
  <script src="../../js/site-chrome.js"></script>
  <script src="../../js/lang.js"></script>
</head>
<body data-app-name="Hwatu">
  <main class="wrap">
    <article class="legal">
      <header class="legal__head">
        <h1 data-i18n="${h1Key}">${t(h1Key)}</h1>
        <p class="legal__meta"><span data-icon="doc"></span><span data-i18n="${metaKey}">${t(metaKey)}</span></p>
      </header>
${render(spec)}
    </article>
  </main>
</body>
</html>
`;
}

const privacySpec = [
  'h2:privacyIntroduction', 'p:privacyIntro',
  'h2:privacyDataCollection', 'p:privacyDataCollectionText',
  ['ul', 'privacyAccountInfo', 'privacyDeviceInfo', 'privacyUsageData', 'privacyProgressData', 'privacyOnlineData',
    'privacyAdIdentifiers', 'privacyPushToken', 'privacyPurchaseInfo', 'privacyFeedbackData', 'privacyConsentRecords'],
  'p:privacyNotificationsText',
  'h2:privacyDataUsage', 'p:privacyDataUsageText',
  ['ul', 'privacyOperateGame', 'privacyAccountUse', 'privacyProcessPurchases', 'privacyServeAds', 'privacyOnlineFeatures',
    'privacyNotificationsUse', 'privacySecurityUse', 'privacyConsentRecordsUse'],
  'h2:privacyLegalBasis', 'p:privacyLegalBasisText',
  ['ul', 'privacyContractNecessity', 'privacyConsent', 'privacyLegitimateInterests', 'privacyLegalObligation'],
  'h2:privacyDataRights', 'p:privacyDataRightsText',
  ['ul', 'privacyAccess', 'privacyRectification', 'privacyErasure', 'privacyRestriction', 'privacyObjection',
    'privacyPortability', 'privacyWithdrawConsent'],
  'p:privacyExerciseRights', 'p:privacySupervisoryText',
  'h2:privacyCCPARights', 'p:privacyCCPARightsText',
  ['ul', 'privacyAccessRequest', 'privacyDeletionRequest', 'privacyCorrectionRequest', 'privacyOptOut'],
  'p:privacyCPRAShareText', 'p:privacyExerciseCCPARights',
  'h2:privacyDataSharing', 'p:privacyDataSharingText',
  ['ul', 'privacyShareFirebase', 'privacyShareSignIn', 'privacyShareAdNetworks', 'privacyShareCmp', 'privacyShareStores',
    'privacyLegalRequirements'],
  'p:privacyProcessorsText', 'p:privacyThirdPartyPoliciesText',
  ['ul',
    '<li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google (Firebase, Google Play, UMP)</a></li>',
    '<li><a href="https://www.applovin.com/privacy/" target="_blank" rel="noopener">AppLovin</a></li>',
    '<li><a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener">Apple</a></li>'],
  'h2:privacyAdvertising', 'p:privacyAdvertisingText',
  'h2:privacyCloudSave', 'p:privacyCloudSaveText', 'p:privacyCloudSaveLegacyText',
  'h2:privacyRetention', 'p:privacyRetentionText',
  'h2:privacyTransfers', 'p:privacyTransfersText',
  'h2:privacyDataSecurity', 'p:privacyDataSecurityText',
  'h2:privacyChildren', 'p:privacyChildrenText',
  'h2:privacyChanges', 'p:privacyChangesText',
  'h2:privacyContact', 'p:privacyContactText',
  'h2:privacyGoverningLaw', 'p:privacyGoverningLawText',
  'h2:privacyWebsite', 'p:privacyWebsiteText'
];

const termsSpec = [
  'h2:termsGeneralProvisions', 'p:termsGeneralProvisionsText',
  'h2:termsLicenseGrant', 'p:termsLicenseGrantText',
  'h2:termsRestrictions', 'p:termsRestrictionsText',
  ['ul', 'termsRestriction1', 'termsRestriction2', 'termsRestriction3', 'termsRestriction4'],
  'h2:termsIntellectualProperty', 'p:termsIntellectualPropertyText', 'p:termsCardArtText',
  'h2:termsInApp', 'p:termsInAppText',
  'h2:termsSimulatedGambling', 'p:termsSimulatedGamblingText',
  'h2:termsSubscription', 'p:termsSubscriptionText',
  'h2:termsAccount', 'p:termsAccountText',
  'h2:termsAdvertising', 'p:termsAdvertisingText',
  '<p><a href="privacy.html" data-i18n="privacy">Privacy Policy</a></p>',
  'h2:termsOnlinePlay', 'p:termsOnlinePlayText', 'p:termsOnlineAccessText', 'p:termsTournamentsText',
  'h2:termsPrivacy', 'p:termsPrivacyText',
  '<p><a href="privacy.html" data-i18n="privacy">Privacy Policy</a></p>',
  'h2:termsDisclaimer', 'p:termsDisclaimerText',
  'h2:termsLiability', 'p:termsLiabilityText',
  'h2:termsModifications', 'p:termsModificationsText',
  'h2:termsTermination', 'p:termsTerminationText',
  'h2:termsGoverningLaw', 'p:termsGoverningLawText',
  'h2:termsContact', 'p:termsContactText',
  '<p><a href="mailto:robaya.studio@gmail.com">robaya.studio@gmail.com</a></p>'
];

// Every key of the agreements must be on the page — a key added to translations but not to
// the spec would silently never be shown.
const used = new Set(JSON.stringify([privacySpec, termsSpec]).match(/(privacy|terms)[A-Z][A-Za-z0-9]*/g));
const unused = Object.keys(en).filter((k) => /^(privacy|terms)[A-Z]/.test(k) && !used.has(k)
  && !['privacyTitle', 'privacyLastUpdated', 'termsTitle', 'termsLastUpdated'].includes(k));
if (unused.length) {
  throw new Error(`keys not placed on a page: ${unused.join(', ')}`);
}

fs.writeFileSync(path.join(site, 'games/hwatu/privacy.html'),
  page({ titleKey: 'hwatuPrivacyTitle', h1Key: 'privacyTitle', metaKey: 'privacyLastUpdated', spec: privacySpec, canonical: 'privacy.html' }));
fs.writeFileSync(path.join(site, 'games/hwatu/terms.html'),
  page({ titleKey: 'hwatuTermsTitle', h1Key: 'termsTitle', metaKey: 'termsLastUpdated', spec: termsSpec, canonical: 'terms.html' }));
console.log('ok');
