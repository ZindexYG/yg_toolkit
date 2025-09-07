import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

import Bankaccount from './TabsComponents/Bankaccount'
import CreditCode from './TabsComponents/CreditCode'
import IDcard from './TabsComponents/IDcard'
import OrgCode from './TabsComponents/OrgCode'
import PhoneNo from './TabsComponents/PhoneNo'

const TabsDates = [
  {
    title: '身份证号码',
    value: 'iDcard',
  },
  {
    title: '组织机构代码',
    value: 'orgCode',
  },
  {
    title: '统一社会信用代码',
    value: 'creditCode',
  },
  {
    title: '手机号码',
    value: 'phoneNo',
  },
  {
    title: '银行卡账号',
    value: 'bankaccount',
  },
]

export function Generator() {
  return (
    <div>
      <Tabs defaultValue="iDcard">
        <TabsList className="w-full flex justify-around">
          {/* <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger> */}
          {TabsDates.map(item => (
            <TabsTrigger className="flex`" value={item.value} key={item.value}>{item.title}</TabsTrigger>
          ))}
        </TabsList>
        <Bankaccount />
        <CreditCode />
        <IDcard />
        <OrgCode />
        <PhoneNo />
        {/* <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-name">Name</Label>
                <Input id="tabs-demo-name" defaultValue="Pedro Duarte" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-username">Username</Label>
                <Input id="tabs-demo-username" defaultValue="@peduarte" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you&apos;ll be logged
                out.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-current">Current password</Label>
                <Input id="tabs-demo-current" type="password" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="tabs-demo-new">New password</Label>
                <Input id="tabs-demo-new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  )
}

export default Generator
