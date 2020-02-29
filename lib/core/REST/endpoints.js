class EndpointDefinition {
  constructor(options={}, routes={}){
    const { 
      description = '',
      strict = true,
      endpoint,
      ...methods
    } = options
    this.$strict = strict
    this.$endpoint = endpoint
    this.$methods = methods
    this.$description = description
    Object.assign(this, routes)
  }

  $get(method){
    if(!this.$strict){
      return this.$endpoint
    }
    if(!this.$methods[method.toUpperCase()]){
      throw new Error(`${method} ${this.$endpoint} is not a valid method`)
    }
    return this.$endpoint
  }
}

/**
 * @param {*} obj 
 * @param {string} root 
 * @returns {ENDPOINTS}
 */
function _construct(obj, base=''){
  if(obj instanceof EndpointDefinition){
    obj.$endpoint = base
    return obj
  }
  const endpoint = new EndpointDefinition({
    endpoint : base,
    GET : true
  })
  if(typeof obj === 'string'){
    endpoint.$description = obj
    return endpoint
  }
  for(let [key, value] of Object.entries(obj)){
    const url = (base+'/'+key).toLowerCase()
    endpoint[key] = _construct(value, url)
  }
  return endpoint
}

const ENDPOINTS = {
  LOGIN : new EndpointDefinition({
    POST : true
  }),
  VIRTUAL_BROWSER : {
    START : new EndpointDefinition({
      GET : true
    }),
    STOP : new EndpointDefinition({
      GET : true
    })
  }
}

export default _construct(ENDPOINTS)