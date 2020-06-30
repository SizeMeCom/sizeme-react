import React, { useEffect, Suspense } from "react"
import Loading from "./common/Loading"
import { uiOptions } from "./api/options"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "./store"
import { toggleSizemeHidden } from "./store/system/actions"

const SizeMeApp = React.lazy(() => import("./SizeMeApp"))

type TogglerProps = { sizemeHidden: boolean }
function SizemeToggler({ sizemeHidden }: TogglerProps) {
    const { t } = useTranslation()
    const dispatch = useDispatch()

    function toggle() {
        dispatch(toggleSizemeHidden())
    }

    return (
        <div className={`sizeme-toggler ${sizemeHidden ? "sm-hidden" : "sm-visible"}`}>
            <a onClick={toggle}>
                {t("common.togglerText")} <i className="fa" aria-hidden />
            </a>
        </div>
    )
}

export default function SizeMeAppWrapper() {
    const sizemeHidden = useSelector((state: RootState) => state.system.sizemeHidden)
    const [tokenResolved, productResolved] = useSelector((state: RootState) => [
        state.auth.resolved,
        state.productInfo.resolved
    ])

    if (tokenResolved && productResolved) {
        return (
            <>
                {uiOptions && uiOptions.toggler && <SizemeToggler sizemeHidden={sizemeHidden} />}
                {!sizemeHidden && (
                    <Suspense fallback={<Loading />}>
                        <SizeMeApp />
                    </Suspense>
                )}
            </>
        )
    }
    return null
}
