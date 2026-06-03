import areaData from "./area.json";

const area: Record<string, any> = areaData as any;

export interface AreaItem {
  code: string;
  name: string;
}

export function getProvinces(): AreaItem[] {
  const provinces: AreaItem[] = [];
  for (const provinceCode in area) {
    const provinceName = Object.keys(area[provinceCode])[0];
    provinces.push({ code: provinceCode, name: provinceName });
  }
  return provinces;
}

export function getCities(provinceCode: string): AreaItem[] {
  if (!provinceCode) return [];
  const provinceName = Object.keys(area[provinceCode])[0];
  const citiesData = area[provinceCode][provinceName];
  const cities: AreaItem[] = [];
  for (const cityCode in citiesData) {
    const cityName = Object.keys(citiesData[cityCode])[0];
    cities.push({ code: cityCode, name: cityName });
  }
  return cities;
}

export function getDistricts(provinceCode: string, cityCode: string): AreaItem[] {
  if (!provinceCode || !cityCode) return [];
  const provinceName = Object.keys(area[provinceCode])[0];
  const cityName = Object.keys(area[provinceCode][provinceName][cityCode])[0];
  const districtsData = area[provinceCode][provinceName][cityCode][cityName];
  const districts: AreaItem[] = [];
  for (const districtCode in districtsData) {
    districts.push({ code: districtCode, name: districtsData[districtCode] });
  }
  return districts;
}

let cachedAllDistrictCodes: string[] | null = null;
export function getAllDistrictCodes(): string[] {
  if (cachedAllDistrictCodes) return cachedAllDistrictCodes;
  const codes: string[] = [];
  for (const provinceCode in area) {
    const provinceName = Object.keys(area[provinceCode])[0];
    const citiesData = area[provinceCode][provinceName];
    for (const cityCode in citiesData) {
      const cityName = Object.keys(citiesData[cityCode])[0];
      const districtsData = citiesData[cityCode][cityName];
      for (const districtCode in districtsData) {
        codes.push(districtCode);
      }
    }
  }
  cachedAllDistrictCodes = codes;
  return codes;
}
