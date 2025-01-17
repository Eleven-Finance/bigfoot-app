import React, { useState } from "react"
import PropTypes from 'prop-types'
import { connect } from "react-redux"
import { Link } from "react-router-dom"

// Redux Store
import { showRightSidebarAction, toggleLeftmenu } from "../../store/actions"


//i18n
import { withTranslation } from "react-i18next"

import WalletConnector from "components/BigFoot/WalletConnector"

import { ReactComponent as BigfootLogoSvg } from "../../assets/images/bigfoot/bigfoot-logo.svg"

const Header = props => {
  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box">
              <Link to="/" className="logo logo-light">
                <span className="logo-sm">
                  <BigfootLogoSvg />
                </span>
                <span className="logo-lg">
                  <BigfootLogoSvg /> BigFoot 
                </span>
              </Link>
              <a id="powered-by" href="https://eleven.finance/" target="_blank">
                powered by eleven.finance
              </a>
            </div>

            <button
              type="button"
              className="btn btn-sm px-3 font-size-16 d-lg-none header-item waves-effect waves-light"
              data-toggle="collapse"
              onClick={() => {
                props.toggleLeftmenu(!props.leftMenu)
              }}
              data-target="#topnav-menu-content"
            >
              <i className="fa fa-fw fa-bars"/>
            </button>
          </div>

          <div className="d-flex">
            <WalletConnector />
          </div>
        </div>
      </header>
    </React.Fragment>
  )
}

Header.propTypes = {
  leftMenu: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func
}

const mapStatetoProps = state => {
  const { layoutType, showRightSidebar, leftMenu } = state.Layout
  return { layoutType, showRightSidebar, leftMenu }
}

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
})(withTranslation()(Header))
