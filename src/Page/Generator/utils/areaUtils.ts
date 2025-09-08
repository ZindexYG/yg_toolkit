import areaData from './area.json';

const area: Record<string, any> = areaData as any;

/**
 * 表示地区项目（省份、城市或区县）的接口
 */
export interface AreaItem {
  /** 地区代码 */
  code: string;
  /** 地区名称 */
  name: string;
}

/**
 * 获取所有省份列表
 *
 * @returns 省份列表，包含代码和名称
 */
export function getProvinces(): AreaItem[] {
  const provinces: AreaItem[] = [];
  for (const provinceCode in area) {
    const provinceName = Object.keys(area[provinceCode])[0];
    provinces.push({
      code: provinceCode,
      name: provinceName,
    });
  }
  return provinces;
}

/**
 * 根据省份代码获取城市列表
 *
 * @param provinceCode - 省份代码
 * @returns 城市列表，包含代码和名称
 */
export function getCities(provinceCode: string): AreaItem[] {
  if (!provinceCode)
    return [];

  const provinceName = Object.keys(area[provinceCode])[0];
  const cities: AreaItem[] = [];
  const citiesData = area[provinceCode][provinceName];

  for (const cityCode in citiesData) {
    const cityName = Object.keys(citiesData[cityCode])[0];
    cities.push({
      code: cityCode,
      name: cityName,
    });
  }

  return cities;
}

/**
 * 根据省份代码和城市代码获取区县列表
 *
 * @param provinceCode - 省份代码
 * @param cityCode - 城市代码
 * @returns 区县列表，包含代码和名称
 */
export function getDistricts(provinceCode: string, cityCode: string): AreaItem[] {
  if (!provinceCode || !cityCode)
    return [];

  const provinceName = Object.keys(area[provinceCode])[0];
  const cityName = Object.keys(area[provinceCode][provinceName][cityCode])[0];
  const districtsData = area[provinceCode][provinceName][cityCode][cityName];

  const districts: AreaItem[] = [];
  for (const districtCode in districtsData) {
    districts.push({
      code: districtCode,
      name: districtsData[districtCode],
    });
  }

  return districts;
}