<script setup>
import { ref } from 'vue'
import {
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Loader2 } from 'lucide-vue-next'
import { ScrollArea } from '@/components/ui/scroll-area'
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { FormItem } from '@/components/ui/form/index.js'
import { fetchAITravelList } from '@/api/aiService.js'

// Define the Zod schema and convert it to a vee-validate schema
const formSchema = toTypedSchema(
  z.object({
    selectedTravelType: z
      .string()
      .min(1, {
        message: '여행 유형을 선택해주세요.',
      })
      .default(''),
    budgetRange: z
      .string()
      .min(1, {
        message: '예산 범위를 입력해주세요.',
      })
      .default(''),
    activities: z
      .string()
      .min(1, {
        message: '활동을 입력해주세요.',
      })
      .default(''),
    travelDuration: z
      .string()
      .min(1, {
        message: '여행 기간을 선택해주세요.',
      })
      .default(''),
  }),
)

const form = useForm({
  validationSchema: formSchema,
})

const recommendations = ref([])
const isLoading = ref(false)

const onSubmit = form.handleSubmit(async values => {
  isLoading.value = true

  try {
    const data = await fetchAITravelList({
      selectedTravelType: values.selectedTravelType,
      budgetRangeL: values.budgetRangeL,
      activities: values.activities.split(','),
      travelDuration: values.travelDuration,
    })
    recommendations.value = data.destinations
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
})
</script>
<template>
  <Card class="m-6 p-6 max-w-[900px] bg-background">
    <h1 class="text-3xl font-bold mb-8 text-center">AI 여행 추천</h1>
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Form Section -->
      <div class="lg:w-1/3">
        <form @submit="onSubmit" class="space-y-6">
          <FormField name="selectedTravelType" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>여행 유형</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  v-bind="componentField"
                  placeholder="예: 혼자 크리스마스 보낼 때"
                />
              </FormControl>
              <FormDescription>
                여행의 목적이나 상황을 간단히 설명해주세요.
              </FormDescription>
              <div v-auto-animate>
                <FormMessage />
              </div>
            </FormItem>
          </FormField>

          <FormField name="budgetRange" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>예산 범위</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger>
                    <SelectValue placeholder="예산 범위를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5만원 이하">5만원 이하</SelectItem>
                    <SelectItem value="5만원-10만원">5만원-10만원</SelectItem>
                    <SelectItem value="10만원-20만원">10만원-20만원</SelectItem>
                    <SelectItem value="20만원 이상">20만원 이상</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <div v-auto-animate>
                <FormMessage />
              </div>
            </FormItem>
          </FormField>

          <FormField name="travelDuration" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>여행 기간</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger>
                    <SelectValue placeholder="여행 기간을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="당일">당일</SelectItem>
                    <SelectItem value="1박2일">1박2일</SelectItem>
                    <SelectItem value="2박3일">2박3일</SelectItem>
                    <SelectItem value="3박4일">3박4일</SelectItem>
                    <SelectItem value="4박5일 이상">4박5일 이상</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <div v-auto-animate>
                <FormMessage />
              </div>
            </FormItem>
          </FormField>

          <FormField name="activities" v-slot="{ componentField }">
            <FormItem>
              <FormLabel>원하는 활동</FormLabel>
              <FormControl>
                <Textarea
                  v-bind="componentField"
                  placeholder="예: 여행, 맛집"
                  class="resize-none"
                />
              </FormControl>
              <FormDescription>
                원하는 활동을 쉼표로 구분하여 입력해주세요.
              </FormDescription>
              <div v-auto-animate>
                <FormMessage />
              </div>
            </FormItem>
          </FormField>

          <Button type="submit" class="w-full" :disabled="isLoading">
            {{ isLoading ? '추천 중...' : '여행 추천 받기' }}
          </Button>
        </form>
      </div>

      <!-- Recommendations Section -->
      <div class="lg:w-2/3">
        <Card class="h-full">
          <CardHeader>
            <CardTitle>추천 여행지</CardTitle>
            <CardDescription>AI가 추천하는 맞춤 여행지입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              v-if="isLoading"
              class="flex flex-col items-center justify-center h-full"
            >
              <Loader2 class="h-16 w-16 animate-spin text-primary" />
              <p class="mt-4 text-lg font-medium text-gray-600">
                AI가 최적의 여행지를 찾고 있어요...
              </p>
              <div class="mt-4 text-sm text-gray-500 text-center max-w-md">
                <p class="mb-2">여행 취향을 분석하고</p>
                <p class="mb-2">최신 여행 트렌드를 고려하며</p>
                <p>당신만을 위한 특별한 여행을 구상 중입니다</p>
              </div>
            </div>
            <div v-else-if="recommendations.length > 0">
              <ScrollArea class="h-[calc(100vh-300px)]">
                <div class="grid gap-4 lg:grid-cols-2">
                  <Card v-for="(rec, index) in recommendations" :key="index">
                    <CardHeader>
                      <CardTitle>{{ rec.name }}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{{ rec.description }}</CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </div>
            <div v-else class="text-center text-gray-500">
              여행 정보를 입력하고 추천 받기 버튼을 눌러주세요.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </Card>
</template>

<style scoped>
/* 추가적인 스타일을 여기에 작성하세요 */
</style>
