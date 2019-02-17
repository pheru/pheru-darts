class CheckoutUtil {
    static getPossibleCheckout(score, dartCount, checkoutMode) {
        switch (dartCount) {
            case 1:
                return oneDartCheckout(score, checkoutMode);
            case 2:
                return twoDartCheckout(score, checkoutMode);
            case 3:
                return threeDartCheckout(score, checkoutMode);
            default:
                return [];
        }
    }

    static getPossibleCheckoutAsString(score, dartCount, checkoutMode, separator) {
        let possibleCheckout = CheckoutUtil.getPossibleCheckout(score, dartCount, checkoutMode);
        if (possibleCheckout.length === 0) {
            return "Nicht möglich";
        }
        let asString = "";
        for (let i = 0; i < possibleCheckout.length; i++) {
            if (i > 0) {
                asString += separator;
            }
            asString += possibleCheckout[i];
        }
        return asString;
    }
}

function oneDartCheckout(score, checkoutMode) {
    return [];
}

function twoDartCheckout(score, checkoutMode) {
    return [];
}

function threeDartCheckout(score, checkoutMode) {
    return [];
}

export default CheckoutUtil;