<script setup>
import { ref, watch } from 'vue'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { fetchAttractionDetails } from '@/api/detailsService.js'
import { ImageOff } from 'lucide-vue-next'

const props = defineProps({
  contentId: Number,
  images: Array,
  title: String,
})

const overview = ref(null)
const homepage = ref(null)

const current = ref(0)
const carouselApi = ref()

const loading = ref(false)
const error = ref(null)

const isDialogOpen = ref(false)

watch(isDialogOpen, async value => {
  if (value && overview.value === null) {
    loading.value = true
    error.value = null
    try {
      const detail = await fetchAttractionDetails(props.contentId)
      overview.value = detail.overview
      homepage.value = detail.homepage
    } catch (err) {
      console.error(err)
      error.value = err
    } finally {
      loading.value = false
    }
  }
})
</script>

<template>
  <Dialog v-model:open="isDialogOpen">
    <DialogTrigger as-child>
      <slot></slot>
    </DialogTrigger>

    <DialogContent
      class="sm:max-w-[900px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]"
    >
      <DialogHeader class="p-6 pb-0">
        <DialogTitle>{{ props.title }}</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4 overflow-y-auto px-6">
        <div class="flex flex-col justify-between">
          <Carousel
            :opts="{ align: 'start', loop: true }"
            class="w-full"
            @init-api="
              val => {
                carouselApi = val
                carouselApi.on('select', () => {
                  // Do something on select.
                  current = carouselApi.selectedScrollSnap()
                })
              }
            "
          >
            <div
              class="absolute top-1 right-1 bg-black/50 text-white text-sm font-bold px-2 py-1 rounded-md backdrop-blur-sm z-10"
            >
              {{ current + 1 }} / {{ images.length }}
            </div>
            <CarouselContent>
              <CarouselItem v-for="(image, index) in images" :key="index">
                <Card class="border-0">
                  <CardContent class="relative h-[400px] sm:h-[600px] p-0">
                    <img
                      v-if="image.src"
                      :src="image.src"
                      :alt="image.alt"
                      width="800"
                      height="600"
                      class="w-full h-full object-cover rounded-lg"
                    />
                    <ImageOff
                      v-else
                      class="w-full h-full object-cover aspect-square p-6"
                      color="gray"
                    />
                    <div class="absolute bottom-4 left-4 right-4 w-fit">
                      <p
                        class="text-white text-sm bg-black/50 p-2 rounded-md backdrop-blur-sm"
                      >
                        {{ image.caption }}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>

            <CarouselPrevious
              class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white backdrop-blur-sm rounded-full p-2 hover:bg-black/70 hover:text-white transition-colors h-8 w-8 border-0"
            />
            <CarouselNext
              class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white backdrop-blur-sm rounded-full p-2 hover:bg-black/70 hover:text-white transition-colors h-8 w-8 border-0"
            />
          </Carousel>
          <p class="text-lg font-semibold mt-6">상세정보</p>
          <Separator class="mt-2" label="" />
          <p class="mt-2" v-html="overview" />
          <Separator class="mt-6" label="" />
          <ul class="list-disc ml-6 mt-4">
            <li>
              <div class="flex justify-between flex-wrap">
                홈페이지
                <span v-html="homepage"></span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <DialogFooter class="p-6 pt-0"></DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped></style>
