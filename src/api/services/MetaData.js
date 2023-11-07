const {connect, exeQuery } = require('../controllers/database/dbFunctions')
const { setToBooking } = require('./woocommerce')


async function getMetaDataFromPost(id){
    
    connect()
  
    const sql = "SELECT * FROM `id5_postmeta` WHERE post_id = ?"
    const result = await exeQuery(sql, [id])
    return result
  
  
  }

  async function getMaxMetaId(){
    connect()

    const sql = "SELECT MAX(meta_id) FROM `id5_postmeta`"
    const result = await exeQuery(sql)

    return result
  }

function createMetaData(meta_id, post_id, meta_key, meta_value){
    const metaData = {
      meta_id: meta_id,
      post_id: post_id,
      meta_key: meta_key,
      meta_value: meta_value,
    }
    
    return metaData
  }
  
  
  
async function createMetaDataForPost(post_id, commission, price){
  const defaultmeta = [
    {
      meta_key:'_wc_booking_type',
      meta_value:'customer-defined'
    },
    {
      meta_key:'_edit_lock',
      meta_value:'1693228023:1476',
    },
    {
      meta_key:'_edit_last',
      meta_value:'1476',
    },
    {
      meta_key:'_product_video_gallery',
      meta_value:'',
    },
    {
      meta_key:'_product_video_code',
      meta_value:'',
    },
    {
      meta_key:'_sale_price_time_start',
      meta_value:'',
    },
    {
      meta_key:'total_sales',
      meta_value:'0',
    },
    {
      meta_key:'_tax_status',
      meta_value:'taxable',
    },
    {
      meta_key:'_tax_class',
      meta_value:'',
    },
    {
      meta_key:'_manage_stock',
      meta_value:'no',
    },    
    {
      meta_key:'_sold_individually',
      meta_value:'no',
    },    
    {
      meta_key:'_virtual',
      meta_value:'yes',
    },
        
    {
      meta_key:'_downloadable',
      meta_value:'no',
    },    
    {
      meta_key:'_download_limit',
      meta_value:'-1',
    },    
    {
      meta_key:'_download_expiry',
      meta_value:'-1',
    },    
    {
      meta_key:'_stock',
      meta_value:'null',
    },
    {
      meta_key:'_stock_status',
      meta_value:'instock',
    },
    {
      meta_key:'_wc_avarage_rating',
      meta_value:'0',
    },
    {
      meta_key:'_wc_review_count',
      meta_value:'0',
    },
    {
      meta_key:'_has_additional_costs',
      meta_value:'null',
    },
    {
      meta_key:'_wc_booking_apply_adjacent_buffer',
      meta_value:'',
    },
    {
      meta_key:'_wc_booking_availability',
      meta_value:'a:1:{i:0;a:5:{s:4:"type";s:6:"custom";s:8:"bookable";s:2:"no";s:8:"priority";i:1;s:4:"from";s:0:"";s:2:"to";s:0:"";}}',
    },
    {
      meta_key:'_wc_booking_buffer_period',
      meta_value:'0',
    },
    {
      meta_key:'_wc_booking_calendar_display_mode',
      meta_value:'always_visible',
    },
    {
      meta_key:'_wc_booking_cancel_limit_unit',
      meta_value:'month',
    },
    {
      meta_key: '_wc_booking_cancel_limit',
      meta_value:'1',
    },
    {
      meta_key: '_wc_booking_check_availability_against',
      meta_value: ''
    },
    {
      meta_key: '_wc_booking_cost',
      meta_value: `${price}`
    },
    {
      meta_key: '_wc_booking_default_date_availability',
      meta_value: 'available'
    },
    {
      meta_key: '_wc_booking_duration_type',
      meta_value: 'fixed'
    },
    {
      meta_key: '_wc_booking_duration_unit',
      meta_value: 'day'
    },
    {
      meta_key: '_wc_booking_duration',
      meta_value: '7'
    },
    {
      meta_key: '_wc_booking_enable_range_picker',
      meta_value: 'yes'
    },
    {
      meta_key: '_wc_booking_first_block_time',
      meta_value: ''
    },
    {
      meta_key: '_wc_booking_has_person_types',
      meta_value: ''
    },
    {
      meta_key: '_wc_booking_has_persons',
      meta_value: ''
    },
    {
      meta_key: '_wc_booking_has_resources',
      meta_value: '0'
    },
    {
      meta_key: '_wc_booking_has_restricted_days',
      meta_value: ''
    },
    {
      meta_key: '_wc_booking_max_date_unit',
      meta_value: 'month'
    },
    {
      meta_key: '_wc_booking_max_date',
      meta_value: '3'
    },
    {
      meta_key: '_wc_booking_max_duration',
      meta_value: '1'
    },
    {
      meta_key: '_wc_booking_max_persons_group',
      meta_value: '1'
    },
    {
      meta_key: '_wc_booking_min_date_unit',
      meta_value: 'day'
    },
    {
      meta_key: '_wc_booking_min_date',
      meta_value: '2'
    },
    {
      meta_key: '_wc_booking_min_duration',
      meta_value: '1'
    },
    {
      meta_key: '_wc_booking_min_persons_group',
      meta_value: '1'
    },
    {
      meta_key: '_wc_booking_person_cost_multiplier',
      meta_value: ''
    },
    {
      meta_key: '_wc_booking_person_qty_multiplier',
      meta_value: ''
    },
    {
      meta_key: '_wc_booking_pricing',
      meta_value: 'a:0:{}'
    },
    {
      meta_key: '_wc_booking_qty',
      meta_value: '1000'
    },
    {
      meta_key: '_wc_booking_requires_confirmation',
      meta_value: ''
    },
    // {
    //   meta_key: '_wc_booking_resources_assignment',
    //   meta_value: 'customer'
    // },
    {
      meta_key: '_wc_booking_restricted_days',
      meta_value: ''
    },
    {
      meta_key: '_wc_booking_user_can_cancel',
      meta_value: ''
    },
    {
      meta_key: '_wc_display_cost',
      meta_value: ''
    },
    // {
    //   meta_key: 'wc_booking_resource_label',
    //   meta_value: 'Turno'
    // },
    {
      meta_key: '_price',
      meta_value: `${price}`
    },
    // {
    //   meta_key: '_resource_base_costs',
    //   meta_value: 'a:2:{i:22892;s:0:"";i:22893;s:0:"";}'
    // },
    // {
    //   meta_key: '_resource_block_costs',
    //   meta_value: 'a:2:{i:22892;s:0:"";i:22893;s:0:"";}'
    // },
    {
      meta_key: '_product_version',
      meta_value: '4.3.1'
    },
    {
      meta_key: '_product_video_gallery',
      meta_value: ''
    },
    {
      meta_key: '_product_video_code',
      meta_value: ''
    },
    {
      meta_key: '_product_video_autoplay',
      meta_value: ''
    },
    {
      meta_key: '_dokan_wholesale_meta',
      meta_value: 'a:3:{s:16:"enable_wholesale";s:2:"no";s:5:"price";s:0:"";s:8:"quantity";s:0:"";}'
    },
    {
      meta_key: '_sale_price_time_start',
      meta_value: ''
    },
    {
      meta_key: '_sale_price_time_end',
      meta_value: ''
    },
    {
      meta_key: '_per_product_admin_commission_type',
      meta_value: 'percentage'
    },
    {
      meta_key: '_per_product_admin_commission',
      meta_value: `${commission}`
    },
    {
      meta_key: '_per_product_admin_additional_fee',
      meta_value: ''
    },
    {
      meta_key: '_wc_memberships_use_custom_product_viewing_restricted_message',
      meta_value: 'no'
    },
    {
      meta_key: '_wc_memberships_use_custom_product_purchasing_restricted_message',
      meta_value: 'no'
    },
    {
      meta_key: '_wc_memberships_force_public',
      meta_value: 'no'
    },
    {
      meta_key: '_wc_memberships_exclude_discounts',
      meta_value: 'no'
    },
    {
      meta_key: '_yoast_wpseo_primary_product_cat',
      meta_value: '96'
    },
    {
      meta_key: 'snp_p_welcome_popup',
      meta_value: 'global'
    },
    {
      meta_key: 'snp_p_mobile_welcome_popup',
      meta_value: 'global'
    },
    {
      meta_key: 'snp_p_exit_popup',
      meta_value: 'global'
    },
    {
      meta_key: 'snp_p_mobile_exit_popup',
      meta_value: 'global'
    },
    {
      meta_key: '_et_single_layout',
      meta_value: 'standard'
    },
    {
      meta_key: '_et_single_thumbnail_hover',
      meta_value: 'inherit'
    },
    {
      meta_key: '_et_product_view_hover',
      meta_value: 'inherit'
    },
    {
      meta_key: '_et_product_view_color',
      meta_value: 'inherit'
    },
    {
      meta_key: '_et_additional_block',
      meta_value: '0'
    },
    {
      meta_key: '_et_sale_counter',
      meta_value: 'disable'
    },
    {
      meta_key: '_et_product_slider',
      meta_value: 'inherit'
    },
    {
      meta_key: '_et_primary_category',
      meta_value: 'auto'
    },
    {
      meta_key: '_purchase_note',
      meta_value: ''
    },
    {
      meta_key: '_sbi_oembed_done_checking',
      meta_value: '1'
    },
    {
      meta_key: 'pageview',
      meta_value: '1'
    },
    {
      meta_key: '_backorders',
      meta_value:'no'
    },
    {
      meta_key: '_wc_avarage_rating',
      meta_value:'0'
    },
    {
      meta_key: '_wc_booking_block_cost',
      meta_value:'0'
    },
    {
      meta_key: '_yoast_wpseo_content_score',
      meta_value:'30'
    },    

  ]

  const metaserial = await getMaxMetaId()
  var id = metaserial[0]['MAX(meta_id)']
  const metaDataArray = []

  for(const meta of defaultmeta){
    id++
    const metaData = createMetaData(id, post_id, meta.meta_key, meta.meta_value)
    metaDataArray.push(metaData)
    
  }

  console.log(metaDataArray);
  console.log(price)
  return metaDataArray
  
}

async function insertMetaData(post_id, vendor_id, commission, price){

  // post_id = 696969
  // commission = 20
  // price = 98.9

  const table = '`id5_postmeta`'
  const fields = `meta_id,
  post_id,
  meta_key,
  meta_value`
  const metaDataArray = await createMetaDataForPost(post_id, vendor_id, commission, price)

  for(const meta of metaDataArray){
    
    const values = `${meta.meta_id},
                    ${meta.post_id},
                   '${meta.meta_key}',
                   '${meta.meta_value}'`
    
    const sql = `INSERT INTO ${table} (${fields}) VALUES (${values})`
    exeQuery(sql)

    
  }

  console.log(price)

  // await setToBooking(post_id)
}

module.exports = {
    getMetaDataFromPost, createMetaDataForPost, insertMetaData
}