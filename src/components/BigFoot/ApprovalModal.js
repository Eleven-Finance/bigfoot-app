import React, { useState } from "react"
import { useWallet } from '@binance-chain/bsc-use-wallet'
import classname from 'classnames';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Container,
  Spinner
} from "reactstrap"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Web3Class from 'helpers/bigfoot/Web3Class'
import Icon from './Icon';

function ApprovalModal({ assetsToApprove, bigfootAddress, toggleApprovalModal }) {
  const [isLoading, setIsLoading] = useState([])
  const [loaded, setIsLoaded] = useState([])
  //wallet & web3
  const wallet = useWallet()
  const web3Instance = new Web3Class(wallet);
  const userAddress = wallet.account;

  const requestBigFootApproval = async (element, i) => {
    const request = await web3Instance.reqApproval(element.address, bigfootAddress);

    request.send({ from: userAddress })
      .on('transactionHash', function (hash) {
        toast.info(`Authorization in process. ${hash}`)
        setIsLoading(prevItems => [...prevItems, element.code]);
      })
      .on('receipt', function (receipt) {
        toggleApprovalModal(null);
        toast.success(`Authorization accepted.`)
        setIsLoading(isLoading.splice(isLoading.indexOf(element.code), 1));
        setIsLoaded(prevItems => [...prevItems, element.code]);
      })
      .on('error', function (error) {
        toast.warn(`Authorization failed. ${error?.message}`)
        setIsLoading(isLoading.splice(isLoading.indexOf(element.code), 1));
      })
      .catch((error) => {
        console.log(`Authorization error. ${error?.message}`)
        setIsLoading(isLoading.splice(isLoading.indexOf(element.code), 1));
      });
  }

  return(
    <Modal
      id="approvalModal"
      isOpen={assetsToApprove?.length}
      role="dialog"
      size="mg"
      autoFocus={true}
      centered={true}
      toggle={() => toggleApprovalModal()}
    >
      <div className="modal-content">
        <ModalHeader toggle={toggleApprovalModal}>
          Confirm approval:
        </ModalHeader>
        <ModalBody>
          <p>
            Approve the following tokens to be spent by BigFoot contract:
          </p>
          <Container>
          {assetsToApprove?.map((el, i) => (
            <div className="d-flex align-items-center justify-content-between mb-3" key={el.code}>
              <div className="d-flex align-items-center">
                <Icon icon={el.icon} />
                <span className="ms-3">
                  {el.code}
                </span>
              </div>
              <button
                className={classname('btn btn-sm w-xs btn-primary', {
                  'd-flex align-items-center': isLoading.includes(el.code),
                  'btn-success': loaded.includes(el.code),
                })}
                onClick={() => requestBigFootApproval(el, i)}
                disabled={isLoading.includes(el.code) || loaded.includes(el.code)}
              >
                {isLoading.includes(el.code) ?
                  <>
                    <Spinner color="light" size="sm" />
                    <span className="ms-2">Approving</span>
                  </>
                  : (loaded.includes(el.code) ?
                    'Approved'
                    :
                    'Approve'
                  )
                }
              </button>
            </div>
          ))}
          </Container>
        </ModalBody>
      </div>
    </Modal>
  );
}

export default ApprovalModal;