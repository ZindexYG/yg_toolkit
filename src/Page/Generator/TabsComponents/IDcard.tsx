import type { AreaItem } from '../utils/areaUtils'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { getCities, getDistricts, getProvinces } from '../utils/areaUtils'

const formSchema = z.object({
  // username: z.string().min(2, {
  //   message: 'Username must be at least 2 characters.',
  // }),
  address: z.object({
    province: z.string().min(1, { message: '请选择省份' }),
    city: z.string().min(1, { message: '请选择城市' }),
    district: z.string().min(1, { message: '请选择区县' }),
  }),
  dob: z.date({
    message: 'A date of birth is required.',
  }),
})

function IDcard() {
  const [selectedProvince, setSelectedProvince] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [cities, setCities] = useState<AreaItem[]>([])
  const [districts, setDistricts] = useState<AreaItem[]>([])

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

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  return (
    <TabsContent value="iDcard">
      <Card className="p-6">
        <div className="w-96 m-auto">

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

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </Card>
    </TabsContent>
  )
}

export default IDcard
