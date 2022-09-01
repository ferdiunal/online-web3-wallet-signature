<script setup>
import { onMounted, ref, nextTick } from 'vue';
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/ethereum-provider";
import {useToast} from "vue-toastification"
const toast = useToast()
const walletConnect = ref(false)
const instance = ref(null);
const signiner = ref(null);
const provider = ref(null);
const wallet = ref(null);
const message = ref(null)
const signature = ref(null)

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "e9a4d7c5bb8c4fd29e240ec315e9b351",
    },
  },
};

const modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: true, // optional
  disableInjectedProvider: false,
  providerOptions, // required
});

const connect = async () => {
  modal.clearCachedProvider();
  instance.value = await modal.connect();
  provider.value = new ethers.providers.Web3Provider(instance.value);
  provider.value.on("accountsChanged", () => this.modal.clearCachedProvider());
  signiner.value = provider.value.getSigner();

  try {
    wallet.value = await signiner.value.getAddress();
    walletConnect.value = true
    setTimeout(() => {
      document.getElementById("message").focus()
    }, 100)
    toast.success("Good Luck ✌️")
  } catch (e) {
    console.log(e);
  }
};

const onSignature = async () => {
  try {
    if (!walletConnect.value) {
      await connect()
    }

    signature.value = await signiner.value.signMessage(
      message.value
    )
    
    toast.success("Signing successful, click to copy result 👊")

  } catch(e) {
    console.log(e)
  }
}

const onCopy = async () => {
  if(!signature.value) return;

  await navigator.clipboard.writeText(signature.value)
    
  toast.success("Result successfully copied 👊")
};

onMounted(connect)

</script>

<template>
  <div class="max-w-7xl mx-auto min-h-screen flex flex-col items-center gap-y-4 justify-center">
    <div class="grid grid-cols-2 gap-x-2 w-full" v-if="walletConnect">

    <textarea id="message" v-model="message" class="h-96 resize-none" placeholder="Message"></textarea>
    <textarea @focus="onCopy" v-model="signature" class="resize-none cursor-default focus:outline-none" readonly placeholder="Signature (Click on Copy Result)"></textarea>

    </div>

    <button :disabled="!message" v-if="walletConnect" @click="onSignature" type="button" class="inline-flex items-center w-1/2  justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        Siging
    </button>
  
  </div>
</template>