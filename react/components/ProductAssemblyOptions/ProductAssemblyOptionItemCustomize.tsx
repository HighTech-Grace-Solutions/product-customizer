import React, { Fragment, useState, FC } from 'react'
import { Button, Modal } from 'vtex.styleguide'
import ProductPrice from 'vtex.store-components/ProductPrice'
import { useDevice } from 'vtex.device-detector'
import { FormattedMessage } from 'react-intl'

import { useProductAssemblyItem } from '../ProductAssemblyContext/Item'
import ProductAssemblyOptionsGroup from './ProductAssemblyOptionsGroup'
import { imageUrlForSize } from './ProductAssemblyOptionItemImage'
import { ProductAssemblyGroupContextProvider } from '../ProductAssemblyContext/Group'
import { withItem } from './withItem'
import StopPropagation from '../StopPropagation'

const IMG_SIZE = 140

const ModalView: FC<{ closeAction: () => void }> = ({
  children,
  closeAction,
}) => {
  const {
    image,
    name,
    children: itemChildren,
    price,
  } = useProductAssemblyItem() as AssemblyItem

  return (
    <div className="flex flex-column">
      <div className="flex">
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img
          src={imageUrlForSize(image, IMG_SIZE)}
          width={IMG_SIZE}
          height={IMG_SIZE}
        />
        <div className="flex flex-column ml5">
          <span className="t-heading-5 c-on-base">{name}</span>
          <ProductPrice
            showLabels={false}
            showListPrice={false}
            sellingPriceContainerClass="t-heading-3 c-on-base"
            sellingPrice={price / 100}
          />
        </div>
      </div>
      {itemChildren &&
        Object.keys(itemChildren).map((childId) => {
          return (
            <ProductAssemblyGroupContextProvider
              key={childId}
              assemblyOption={itemChildren[childId]}
            >
              <ProductAssemblyOptionsGroup>
                {children}
              </ProductAssemblyOptionsGroup>
            </ProductAssemblyGroupContextProvider>
          )
        })}
      <div className="mt3">
        <Button block onClick={closeAction}>
          <div className="c-on-action-primary">DONE</div>
        </Button>
      </div>
    </div>
  )
}

interface Props {
  buttonProps?: ButtonProps
}

interface ButtonProps {
  collapse?: 'left' | 'right' | 'none'
}

const ProductAssemblyOptionItemCustomize: FC<Props> = ({
  children,
  buttonProps = {},
}) => {
  const {
    name,
    children: itemChildren,
  } = useProductAssemblyItem() as AssemblyItem

  const { isMobile } = useDevice()
  const buttonCollapse = buttonProps.collapse
  const [modalOpen, setModalOpen] = useState(false)

  if (!itemChildren) {
    return null
  }

  const handleClick = () => {
    setModalOpen(true)
  }

  const closeAction = () => setModalOpen(false)

  return (
    <Fragment>
      <Button
        variation="tertiary"
        onClick={handleClick}
        collapseLeft={buttonCollapse === 'left'}
        collapseRight={buttonCollapse === 'right'}
      >
        <div className="c-action-primary t-action">
          <FormattedMessage id="store/product-customizer.customize" />
        </div>
      </Button>
      <StopPropagation>
        <Modal
          isOpen={modalOpen}
          onClose={closeAction}
          centered={!isMobile}
          title={`Customize your ${name}`}
        >
          <ModalView closeAction={closeAction}>{children}</ModalView>
        </Modal>
      </StopPropagation>
    </Fragment>
  )
}

export default withItem(ProductAssemblyOptionItemCustomize)
