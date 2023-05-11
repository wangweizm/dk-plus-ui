import { computed, reactive, toRefs, useSlots } from 'vue'
import type { CSSProperties, ComputedRef, Slots } from 'vue'
import { getColor, setSize, getStyleList } from '..'
import { DkInputProps } from './../../dkinput/src/props'
import { DK_INPUT_TYPE } from '../../_tokens'
import type { dkInputType } from '../../_interface'
/**
 * @name getInputGlobalType
 * @Time 2023年05月05日
 * @param { dkInputType | null | undefined } [type] 组件的类型
 * @returns getInputGlobalType 所需要的 props 参数类型接口
 */

export interface getInputGlobalType {
  type?: dkInputType | null
}

export interface getInputType {
  getInputType: (value?: dkInputType) => ComputedRef<dkInputType>
}

/**
 * @name getInput
 * @Time 2023年05月05日
 * @function getInputType 获取input组件的类型
 * @returns input组件hooks
 */
export const getInputGlobal = (props?: getInputGlobalType): getInputType => {
  /**
   * @name getInputType
   * @returns 获取input组件的类型
   */
  const getInputType = (
    value: string | dkInputType = 'text'
  ): ComputedRef<dkInputType> => {
    return computed((): dkInputType => {
      if (!props) {
        return value as dkInputType
      }
      if (props.type && !DK_INPUT_TYPE.includes(props.type as dkInputType)) {
        return value as dkInputType
      }
      return (props.type || value) as dkInputType
    })
  }
  return {
    getInputType
  }
}

export const getInput = (props: DkInputProps) => {
  /**
   * @name defaultClassList
   * @description 期望转换的类名
   */
  let defaultClassList = ['type']

  /**
   * @name params
   * @description 组件传来的props和准备特殊类名合并的处理
   */
  let params = reactive({
    ...toRefs(props)
  })
  /**
   * @name SLOT
   * @description 获取插槽
   */
  const SLOT: Slots = useSlots()
  const IS_SLOT = computed((): boolean => {
    return !(SLOT.default && SLOT.default() && SLOT.default()[0].children)
  })
  if (IS_SLOT) {
    const PREFIX = SLOT.prefix && SLOT.prefix()
    if (PREFIX) {
      defaultClassList = [...defaultClassList, 'prefix']
      params['prefix'] = true
    }
  }

  // console.log('params', params);

  // if (IS_SLOT) {
  //   console.log("isSlot", IS_SLOT);
  //   defaultClassList = [...defaultClassList, "slot"];
  // }
  const { classes } = getStyleList(params, 'input')

  const CLASS_LIST = classes([...defaultClassList], 'dk-input')

  const STYLE_LIST = computed((): CSSProperties => {
    const { borderColor, focusBorderColor, width, height, fontSize, borderRadius, textColor } = props
    
    let defaultStyle = {
      '--input-border': borderColor ? getColor(borderColor).getDeepen(0) : null,
      '--input-width': width ? setSize(width) : null,
      '--input-height': height ? setSize(height) : null,
      '--input-hover-border': borderColor ? getColor(borderColor).getDeepen(0.4) : null,
      '--input-font-size': fontSize ? setSize(fontSize) : null,
      '--input-border-radius': borderRadius ? setSize(borderRadius) : null,
      '--input-focus-border': focusBorderColor ? getColor(focusBorderColor).getDeepen(0) : null,
      '--input-text-color': textColor ? getColor(textColor).getDeepen(0) : null,
    } as CSSProperties

    return defaultStyle
  })

  const WRAPPER_STYLE_LIST = computed((): CSSProperties => {
    const { width, height } = props
    let defaultStyle = {
      '--input-wrapper-width': width,
      '--input-wrapper-height': height
    } as CSSProperties
    return defaultStyle
  })

  const WRAPPER_CLASS_LIST = computed((): string[] => {
    return ['dk-input-wrapper']
  })

  const INNER_CLASS_LIST = computed((): string[] => {
    return ['dk-input-wrapper__inner']
  })

  
  return {
    classList: CLASS_LIST,
    styleList: STYLE_LIST,
    wrapperClassList: WRAPPER_CLASS_LIST,
    wrapperStyleList: WRAPPER_STYLE_LIST,
    innerClassList: INNER_CLASS_LIST
  }
}