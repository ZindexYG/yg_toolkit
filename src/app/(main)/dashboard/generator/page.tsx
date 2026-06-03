import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Bankaccount } from "./_components/bankaccount";
import { CreditCode } from "./_components/credit-code";
import { IDcard } from "./_components/id-card";
import { OrgCode } from "./_components/org-code";
import { PhoneNo } from "./_components/phone-no";

const TABS = [
  { title: "身份证号码", value: "iDcard" },
  { title: "组织机构代码", value: "orgCode" },
  { title: "统一社会信用代码", value: "creditCode" },
  { title: "手机号码", value: "phoneNo" },
  { title: "银行卡账号", value: "bankaccount" },
];

export default function GeneratorPage() {
  return (
    <div>
      <Tabs defaultValue="iDcard">
        <TabsList className="flex h-24 w-full flex-wrap justify-around sm:h-12">
          {TABS.map((item) => (
            <TabsTrigger className="h-9 sm:h-full" value={item.value} key={item.value}>
              {item.title}
            </TabsTrigger>
          ))}
        </TabsList>
        <Bankaccount />
        <CreditCode />
        <IDcard />
        <OrgCode />
        <PhoneNo />
      </Tabs>
    </div>
  );
}
