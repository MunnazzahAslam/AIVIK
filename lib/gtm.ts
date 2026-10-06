export const GTM_ID = "GTM-MSBD5SV6";
export const CONSENT_KEY = "aivik_consent";

// Runs inline at the top of <head>, before anything else. Sets Google Consent
// Mode v2 defaults to "denied" (or "granted" for a visitor who already
// accepted), then starts Google's standard GTM loader. Tags in the container
// see the consent state and only set cookies once it is granted.
export const GTM_HEAD_SCRIPT = `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
var c=null;try{c=localStorage.getItem(${JSON.stringify(CONSENT_KEY)});}catch(e){}
var s=c==="granted"?"granted":"denied";
gtag("consent","default",{ad_storage:s,ad_user_data:s,ad_personalization:s,analytics_storage:s,wait_for_update:500});
gtag("set","ads_data_redaction",s==="denied");
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer',${JSON.stringify(GTM_ID)});
`;
