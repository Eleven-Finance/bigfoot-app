import React, { useState } from "react"
import PropTypes from 'prop-types'

import { connect } from "react-redux"

import { Link } from "react-router-dom"

// Redux Store
import { showRightSidebarAction, toggleLeftmenu } from "../../store/actions"

import bigfootLogoSvg from "../../assets/images/bigfoot/bigfoot-logo.svg"

//i18n
import { withTranslation } from "react-i18next"

const Header = props => {

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box">
              <Link to="/" className="logo logo-light">
                <span className="logo-sm">
                  <img src={bigfootLogoSvg} alt="BigFoot" height="44" />
                </span>
                <span className="logo-lg">
                  <img src={bigfootLogoSvg} alt="BigFoot" height="44" /> BigFoot
                </span>
              </Link>
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
            <button
              onClick={() => {
                console.log("connect wallet...")
              }}
              type="button"
              className="btn header-item noti-icon waves-effect btn-connect-wallet"
            >
              Connect wallet
            </button>
            <div className="d-inline-block">
              <button
                onClick={() => {
                  console.log("settings...")
                }}
                type="button"
                className="btn header-item noti-icon waves-effect"
              >
                <i className="bx bx-cog"/>
              </button>
            </div>
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
