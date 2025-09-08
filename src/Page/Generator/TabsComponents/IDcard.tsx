import type { AreaItem } from '../utils/areaUtils'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon, Clipboard } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Toaster } from '@/components/ui/sonner'
import { TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { getCities, getDistricts, getProvinces } from '../utils/areaUtils'

const formSchema = z.object({
  address: z.object({
    province: z.string().min(1, { message: '请选择省份' }),
    city: z.string().min(1, { message: '请选择城市' }),
    district: z.string().min(1, { message: '请选择区县' }),
  }),
  dob: z.date({
    message: '请选择日期',
  }),
  gender: z.enum(['male', 'female'], {
    message: '请选择性别',
  }),
})

/**
 * 获取身份证校验位
 * @param idCardBase 身份证前17位
 * @returns 校验位
 */
function getVerifyCode(idCardBase: string) {
  const valCodeArr = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
  const wi = ['7', '9', '10', '5', '8', '4', '2', '1', '6', '3', '7', '9', '10', '5', '8', '4', '2']
  let sum = 0

  for (let i = 0; i < 17; i++) {
    sum += Number.parseInt(idCardBase.charAt(i)) * Number.parseInt(wi[i])
  }

  const modValue = sum % 11
  return valCodeArr[modValue]
}

function IDcard() {
  const [selectedProvince, setSelectedProvince] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [cities, setCities] = useState<AreaItem[]>([])
  const [districts, setDistricts] = useState<AreaItem[]>([])

  const [generatedIdCard, setGeneratedIdCard] = useState<string>('') // 份证号状态

  const provinces = getProvinces()

  // 省份变化时更新城市列表
  useEffect(() => {
    if (selectedProvince) {
      const newCities = getCities(selectedProvince)
      setDistricts([])
      setSelectedCity('')
      setCities(newCities)
    }
    else {
      setCities([])
      setDistricts([])
    }
  }, [selectedProvince])

  // 城市变化时更新区县列表
  useEffect(() => {
    if (selectedProvince && selectedCity) {
      const newDistricts = getDistricts(selectedProvince, selectedCity)
      setDistricts(newDistricts)
    }
    else {
      setDistricts([])
    }
  }, [selectedProvince, selectedCity])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // username: '',
      address: {
        province: '',
        city: '',
        district: '',
      },
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // 1. 获取区县代码作为身份证前6位
    const areaCode = values.address.district

    // 2. 生成生日部分 YYYYMMDD
    const birthdate = format(values.dob, 'yyyyMMdd')

    // 3. 生成3位随机数，根据性别确保最后一位的奇偶性
    let randomNum = Math.floor(100 + Math.random() * 900)
    if (values.gender === 'male') {
    // 确保是奇数
      if (randomNum % 2 === 0)
        randomNum += 1
    }
    else {
    // 确保是偶数
      if (randomNum % 2 !== 0)
        randomNum += 1
    }

    // 4. 组合前17位
    const idCardBase = `${areaCode}${birthdate}${randomNum.toString().padStart(3, '0')}`

    // 5. 计算校验位
    const verifyCode = getVerifyCode(idCardBase)

    // 6. 生成完整的身份证号
    const fullIdCard = idCardBase + verifyCode

    // 7. 更新状态
    setGeneratedIdCard(fullIdCard)
  }

  return (
    <TabsContent value="iDcard">
      <Card className="p-6">
        <div className="min-w-36 w-full max-w-96 m-auto">

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <div className="col-start-1 col-end-7">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              /> */}
              {/* 省份选择 */}
              <FormField
                control={form.control}
                name="address.province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>省份</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          setCities([])
                          setDistricts([])
                          setSelectedCity('')
                          setSelectedProvince(value)
                          form.setValue('address.city', '')
                          form.setValue('address.district', '')
                        }}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="选择省份" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {provinces.map(province => (
                              <SelectItem key={province.code} value={province.code}>
                                {province.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 城市选择 */}
              <FormField
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>城市</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          setSelectedCity(value)
                          form.setValue('address.district', '')
                        }}
                        value={field.value}
                        disabled={cities.length === 0}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="选择城市" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {cities.map(city => (
                              <SelectItem key={city.code} value={city.code}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 区县选择 */}
              <FormField
                control={form.control}
                name="address.district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>区县</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={districts.length === 0}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="选择区县" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {districts.map(district => (
                              <SelectItem key={district.code} value={district.code}>
                                {district.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 生日选择 */}

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>生日</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value
                              ? (
                                  field.value && format(field.value, 'yyyy-MM-dd')
                                )
                              : (
                                  <span>选择日期</span>
                                )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={date =>
                            date > new Date() || date < new Date('1900-01-01')}
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 性别选择 */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>性别</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        className="flex flex-wrap gap-4"
                      >
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem value="male" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            男
                          </FormLabel>
                        </FormItem>

                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem value="female" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            女
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className='w-full' type="submit">生成</Button>
            </form>
          </Form>
        </div>
        {generatedIdCard && (
          <Card className="mt-6 gap-1 p-4 text-center">
            <div className="text-sm text-muted-foreground">生成的身份证号</div>
            <div className="flex justify-center items-center gap-2 text-lg font-mono">
              <div>

                {generatedIdCard}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(generatedIdCard)
                  toast.success('已复制到剪贴板')
                }}
              >
                <Clipboard />
              </Button>
            </div>
            <Toaster position="top-center" />
          </Card>
        )}
      </Card>
    </TabsContent>
  )
}

export default IDcard
