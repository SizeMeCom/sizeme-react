import React, { useEffect, Suspense } from "react"
import Loading from "./common/Loading"
import uiOptions from "./api/uiOptions"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "./store"
import { toggleSizemeHidden } from "./store/system/actions"
import { fetchToken } from "./store/auth/actions"
import { requestProductInfo } from "./store/productInfo/actions"

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

/*class SizeMeTogglerComp extends React.Component {
    static propTypes = {
        sizemeHidden: PropTypes.bool.isRequired,
        setSizemeHidden: PropTypes.func.isRequired,
        t: PropTypes.func
    }

    toggle = () => {
        const { sizemeHidden, setSizemeHidden } = this.props
        setSizemeHidden(!sizemeHidden)
    }

    render() {
        const { t, sizemeHidden } = this.props
        return (
            <div className={`sizeme-toggler ${sizemeHidden ? "sm-hidden" : "sm-visible"}`}>
                <a onClick={this.toggle}>
                    {t("common.togglerText")} <i className="fa" aria-hidden />
                </a>
            </div>
        )
    }
} */

export default function SizeMeAppWrapper() {
    const sizemeHidden = useSelector((state: RootState) => state.system.sizemeHidden)
    const [tokenResolved, productResolved] = useSelector((state: RootState) => [
        state.auth.resolved,
        state.productInfo.resolved
    ])
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchToken())
        dispatch(requestProductInfo())
    }, [dispatch])

    useEffect(() => {
        console.log("Token resolved: ", tokenResolved)
        console.log("ProductResolved: ", productResolved)
    }, [tokenResolved, productResolved])

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

/*
class SizeMeAppWrapper extends React.Component {
    static propTypes = {
        resolveAuthToken: PropTypes.func.isRequired,
        getProfiles: PropTypes.func.isRequired,
        getProduct: PropTypes.func.isRequired,
        setSelectedProfile: PropTypes.func.isRequired,
        sizemeHidden: PropTypes.bool.isRequired,
        resolved: PropTypes.bool.isRequired,
        setSizemeHidden: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const { resolveAuthToken, getProfiles, getProduct, setSelectedProfile, sizemeHidden } = this.props
        Promise.all([resolveAuthToken().then((resolved) => getProfiles().then(() => resolved)), getProduct()]).then(
            ([tokenResolved, productResolved]) => {
                const pageEvent = productResolved ? ["", "SM product"] : ["NonSM", "Non-SM product"]
                const logInStatus = tokenResolved ? ["LoggedIn", "logged in"] : ["LoggedOut", "logged out"]
                const hidden = sizemeHidden ? ["Hidden", ", SM hidden"] : ["", ""]

                trackEvent(
                    `productPage${pageEvent[0]}${logInStatus[0]}${hidden[0]}`,
                    `Store: Product page load, ${pageEvent[1]}, ${logInStatus[1]}${hidden[1]}`
                )
                setSelectedProfile()
            }
        )
    }

    render() {
        const { resolved, sizemeHidden, setSizemeHidden } = this.props

        if (resolved) {
            return (
                <>
                    {uiOptions.toggler && (
                        <SizemeToggler sizemeHidden={sizemeHidden} setSizemeHidden={setSizemeHidden} />
                    )}
                    {!sizemeHidden && <SizeMeApp />}
                </>
            )
        } else {
            return null
        }
    }
}

const mapStateToProps = (state) => ({
    resolved: state.authToken.resolved && state.productInfo.resolved,
    sizemeHidden: state.sizemeHidden
})

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            setSelectedProfile: api.setSelectedProfile,
            resolveAuthToken: api.resolveAuthToken,
            getProfiles: api.getProfiles,
            getProduct: api.getProduct,
            setSizemeHidden: api.setSizemeHidden
        },
        dispatch
    )

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(SizeMeAppWrapper))
*/
