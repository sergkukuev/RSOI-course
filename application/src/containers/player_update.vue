<template lang="html">
  <div id="player">
    <p v-if="step !== 2"> Step {{step + 1}} of 2 </p>
    <div id="step1" v-if="step === 0">
      <div id="waiting" v-if="statusScout === 0" class="notification"> 
        Loading... 
      </div>
      <div v-else-if="statusScout == 200">
        <font size="5"> Update player contract: </font>
        </br>
        <input id="selected" type="hidden" disabled>
        <font size="3">Choose the scout from list who updated player ({{ id = $route.params.id }}) contract </font>
        <div class="notification" >
          Number of scouts per page: &nbsp
          <input type="text" v-model="count" v-bind:class="count" v-on:change="update_count" style="width:40px"/>
        </div>
        <table id="scouts" class="table" v-on:click="get_scout('scouts')">
          <thead>
            <tr>
              <th>Name</th>
              <th>Rank</th>
              <th>Amount of Deals</th>
              <th>Amount of Contracts</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in scouts">
              <td>{{item.name}}</td>
              <td>{{item.rank}}</td>
              <td>{{item.amount.deals}}</td>
              <td>{{item.amount.contracts}}</td>
            </tr>
          </tbody>
        </table>
        <div class="notification">
          <div class="">
            <button v-on:click="prev_page" style="margin-left:40%"> << </button>
            &nbsp Page {{page + 1}} &nbsp
            <button v-on:click="next_page"> >> </button>
          </div>
        </div>
      </div>
      <div v-else class="notification">
        <font color="red"> Ooooooops. {{error.message}} : {{error.response.statusText}} </font>
      </div>
    </div>
    <div id="step2" v-else-if="step === 1">
      <font size="5"> Update player contract: </font>
      </br> 
      <font size="3"> New contract information: </font>
      <div class="notification" v-if="statusPlayer === 200">
        <p> Player: </p>
        <div style="margin-left:40px">
          <ul style="list-style-type: disc">
            <li>ID: {{ id = $route.params.id }}</li>
            <li>Name: {{ player.name }}</li>
            <li>Club: {{ player.club }}</li>
            <li>Age: {{ player.age }}</li>
            <li>Rating: {{ player.rating }}</li>
            <li>Contract:</li>
            <ul>
              <li> &nbsp Start date: {{ player.contract.date }}</li>
              <li> &nbsp Years: {{ player.contract.years }}</li>
            </ul>
          </ul>
        </div>
        </br>
      </div>
      <p> New contract: </p>
      <div style="margin-left:40px"> 
        Date: {{data.date}} </p>
        Contract years: &nbsp
        <select v-model="data.years">
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
          <option>6</option>
        </select>
      </div>
      </br> Dealer of the transaction: </br>
      <div style="margin-left:40px">
        <ul style="list-style-type: disc">
          <li>ID: {{scout.id }}</li>
          <li>Name: {{ scout.name }}</li>
          <li>Rank: {{ scout.rank }}</li>
          <li>Contracts {{scout.amount.contracts}}</li>
        </ul>
      </div>
      </br>
      <button v-on:click="update_contract" style="margin-right:10%"> Update </button>    
    </div>
    <div id="step3" v-else>
      <div class="notification">
        <p v-if="status === 0"> Loading... </p> 
        <font color="red" v-else-if="status === 503"> {{ error.message }}. {{error.action}}. </font>
        <router-link v-else to="/players"> Contract confirm </router-link> </br>
      </div>
    </div>
  </div>
</template>

<script>
import {API} from './api'

export default {
  name: 'scouts',
  data: function () {
    return {
      id: '',
      page: 0,
      count: 10,
      step: 0,
      data: {
        scoutID: '',
        date: '21.01.2018',
        years: 1
      },
      scouts: [],
      scout: {},
      player: {},
      status: 0,
      statusScout: 0,
      statusPlayer: 0,
      error: {}
    }
  },
  methods: {
    get_scouts: function () {
      let path = '/scouts?count=' + this.count + '&page=' + this.page
      const authorization = `Bearer ${this.$cookie.get('access_token')}`
      API.get(path, { headers: {authorization} }).then((response) => {
        if (response.data.content.length === 0) {
          --this.page
        } else {
          this.scouts = response.data.content
          this.statusScout = response.status
        }
      }, (err) => {
        this.error = err
        this.statusScout = err.response.status
        console.log(err)
      })
    },
    get_player: function () {
      let path = '/players/' + this.id
      API.get(path).then((response) => {
        this.player = response.data.content
        this.statusPlayer = response.status
      }, (err) => {
        this.statusPlayer = err.status
        console.log(err)
      })
    },
    update_contract: function () {
      this.data.scoutID = this.scout.id
      console.log(this.data)
      let path = '/players/' + this.id + '/contract'
      API.put(path, this.data).then(response => {
        console.log(response.data)
        this.status = response.status
      }, (err) => {
        this.status = err.response.status
        this.error = err.response.data
        console.log(err.response)
      })
      this.step++
    },
    prev_page: function () {
      if (this.page > 0) {
        --this.page
        this.get_scouts()
      }
    },
    next_page: function () {
      ++this.page
      this.get_scouts()
      if (this.scouts.length === 0) {
        this.prev_page()
      }
    },
    update_count: function () {
      this.page = 0
      this.get_scouts()
    },
    get_scout: function (name) {
      let table = document.getElementById(name)
      for (let i = 0; i < table.rows.length; i++) {
        table.rows[i].onclick = function () {
          document.getElementById('selected').value = this.rowIndex
          console.log('Index read')
        }
      }
      let index = document.getElementById('selected').value
      if (index !== '') {
        console.log('Index = ' + index)
        this.scout = this.scouts[index - 1]
        this.step++
        this.get_player()
      }
    }
  },
  mounted: function () {
    this.get_scouts()
  }
}
</script>

<style lang="css">
</style>