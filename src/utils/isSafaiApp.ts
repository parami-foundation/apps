const hasValidDocumentElementRatio =
    [
        320 / 454, // 5, SE (~14)
        375 / 553, // 6, 7, 8, SE2 (~14)
        375 / 548, // 6, 7, 8, SE2 (15~)
        414 / 622, // 6, 7, 8 Plus (~14)
        414 / 617, // 6, 7, 8 Plus (15~)
        375 / 635, // X, Xs, 11 Pro
        414 / 719, // Xs Max, 11 Pro Max
        414 / 715, // Xr, 11
        375 / 629, // 12 mini, 13 mini
        390 / 664, // 12, 12 Pro, 13, 13 Pro
        428 / 746, // 12 Pro Max, 13 Pro Max
    ].some(ratio =>
        ratio === document.documentElement.clientWidth /
        document.documentElement.clientHeight
    )

const hasSafariInUA = /Safari/.test(navigator.userAgent);

const isiOSSafari = hasSafariInUA && hasValidDocumentElementRatio;

export default isiOSSafari;