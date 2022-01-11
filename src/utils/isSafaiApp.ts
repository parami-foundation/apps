const hasValidDocumentElementRatio =
    [
        320 / 454, // 5, SE (~14)
        375 / 553, // 6, 7, 8, SE2 (~14)
        375 / 548, // 6, 7, 8, SE2 (15~)
        414 / 622, // 6, 7, 8 Plus (~14)
        414 / 617, // 6, 7, 8 Plus (15~)
        375 / 634, // X, Xs, 11 Pro (Single Tab)
        375 / 635, // X, Xs, 11 Pro (Tab Bar)
        414 / 718, // Xs Max, 11 Pro Max (Single Tab)
        414 / 719, // Xs Max, 11 Pro Max (Tab Bar)
        414 / 714, // Xr, 11 (Single Tab)
        414 / 715, // Xr, 11 (Tab Bar)
        375 / 628, // 12 mini, 13 mini (Single Tab)
        375 / 629, // 12 mini, 13 mini (Tab Bar)
        390 / 663, // 12, 12 Pro, 13, 13 Pro (Single Tab)
        390 / 664, // 12, 12 Pro, 13, 13 Pro (Tab Bar)
        428 / 745, // 12 Pro Max, 13 Pro Max (Single Tab)
        428 / 746, // 12 Pro Max, 13 Pro Max (Tab Bar)
        375 / 812, // X, Xs, 11 Pro (chrome simulator)
    ].some(ratio =>
        ratio === document.documentElement.clientWidth /
        document.documentElement.clientHeight
    )

const hasSafariInUA = /Safari/.test(navigator.userAgent);

const isiOSSafari = hasSafariInUA && hasValidDocumentElementRatio;

export default isiOSSafari;