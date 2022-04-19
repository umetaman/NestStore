<template>
  <div>
    <h1>Hello</h1>
    <p>{{ $route.fullPath }}</p> <!-- /demo/2?user=123 -->
    <p>{{ $route.name }}</p> <!-- demo-id -->
    <p>{{ $route.params }}</p> <!-- { "id": "2" } -->
    <p>{{ $route.path }}</p> <!-- /demo/2 -->
    <p>{{ $route.query.user }}</p> <!-- 123 -->
  </div>
</template>
