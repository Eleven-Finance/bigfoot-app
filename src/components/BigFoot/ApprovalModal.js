import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { useWallet } from '@binance-chain/bsc-use-wallet'
import {
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap"

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Web3Class from 'helpers/bigfoot/Web3Class'
import Icon from './Icon';



function ApprovalModal(props) {

  //wallet & web3
  const wallet = useWallet()
  const web3Instance = new Web3Class(wallet);
  const userAddress = wallet.account;

  const { assetToApprove, bigfootAddress, toggleApprovalModal } = props;
  

  const requestBigFootApproval = async () => {
    const request = await web3Instance.reqApproval(assetToApprove.address, bigfootAddress);
    request.send({ from: userAddress })
      .on('transactionHash', function (hash) {
        toast.info(`Authorization in process. ${hash}`)
      })
      .on('receipt', function (receipt) {
        toggleApprovalModal(null);
        toast.success(`Authorization accepted.`)
      })
      .on('error', function (error) {
        toast.warn(`Authorization failed. ${error?.message}`)
      })
      .catch((error) => {
        console.log(`Authorization error. ${error?.message}`)
      });
  }


  return(
    <Modal
      id="approvalModal"
      isOpen={assetToApprove}
      role="dialog"
      size="mg"
      autoFocus={true}
      centered={true}
      toggle={toggleApprovalModal}
    >
      <div className="modal-content">
        <ModalHeader toggle={toggleApprovalModal}>
          Confirm approval: {assetToApprove.code}
        </ModalHeader>
        <ModalBody>
          <div
            className="wizard clearfix text-center"
          >
            <p>
              <Icon icon={assetToApprove.icon} />
            </p>
            <p>
              Approve your {assetToApprove.code} to be spent by BigFoot contract.
            </p>
            <div className="actions clearfix">
              <ul role="menu" aria-label="Pagination">
                <li className={"next"} >
                  <Link
                    to="#"
                    onClick={ requestBigFootApproval }
                  >
                    Approve
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </ModalBody>
      </div>
    </Modal>
  );
}

export default ApprovalModal;